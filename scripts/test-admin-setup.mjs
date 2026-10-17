import test from "node:test";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import {
  mkdtemp,
  writeFile,
  readFile,
  rm,
  mkdir,
  stat,
  cp,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  parseAdminEnv as parse,
  setupAdminEntry,
  inspectAdminEnvironment,
} from "./setup-admin-entry.mjs";
import { adminEntry } from "../server/admin-gate.mjs";
const secret = "s".repeat(48),
  entry = "/private-panel-20260101";
async function temporary(run) {
  const root = await mkdtemp(path.join(tmpdir(), "csb-entry-"));
  try {
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("setup принимает KEY=VALUE после npm и сохраняет пользовательский путь короче 32 символов", () =>
  temporary(async (root) => {
    const messages = await setupAdminEntry({
      root,
      environment: {},
      args: [`ADMIN_PATH=${entry}`, `JWT_SECRET=${secret}`],
    });
    const values = parse(await readFile(path.join(root, ".env"), "utf8"));
    assert.equal(values.ADMIN_PATH, entry);
    assert.equal(values.JWT_SECRET, secret);
    assert.equal(adminEntry(values), entry);
    assert.ok(!messages.join("\n").includes(secret));
    assert.ok(!messages.join("\n").includes(entry));
    if (process.platform !== "win32")
      assert.equal((await stat(path.join(root, ".env"))).mode & 0o777, 0o600);
  }));
test("короткий JWT и ошибочные аргументы дают ошибку до записи, без вывода переданного секрета", () =>
  temporary(async (root) => {
    const original =
      'SUPABASE_URL=https://example.test\nJWT_SECRET="' + secret + '"\n';
    await writeFile(path.join(root, ".env"), original);
    const weak = "q".repeat(31);
    await assert.rejects(
      () =>
        setupAdminEntry({
          root,
          environment: {},
          args: [`ADMIN_PATH=${entry}`, `JWT_SECRET=${weak}`],
        }),
      (error) =>
        /JWT_SECRET.*32/.test(error.message) && !error.message.includes(weak),
    );
    assert.equal(await readFile(path.join(root, ".env"), "utf8"), original);
    await assert.rejects(
      () =>
        setupAdminEntry({
          root,
          environment: {},
          args: ["JWT_SECRT=not-for-logs"],
        }),
      (error) => !error.message.includes("not-for-logs"),
    );
    assert.equal(await readFile(path.join(root, ".env"), "utf8"), original);
  }));
test("валидный процессный env поддерживается; хостинговые значения нельзя незаметно перекрыть файлом", () =>
  temporary(async (root) => {
    const environment = { ADMIN_PATH: entry, JWT_SECRET: secret };
    await setupAdminEntry({ root, environment });
    assert.equal(
      parse(await readFile(path.join(root, ".env"), "utf8")).ADMIN_PATH,
      entry,
    );
    await assert.rejects(
      () => setupAdminEntry({ root, environment, args: ["--rotate-secret"] }),
      /внешнем окружении/,
    );
    assert.equal(
      parse(await readFile(path.join(root, ".env"), "utf8")).JWT_SECRET,
      secret,
    );
  }));
test("приоритет Next: env > production.local > local > production > env; setup меняет эффективный файл", () =>
  temporary(async (root) => {
    await writeFile(
      path.join(root, ".env"),
      "SUPABASE_ANON_KEY=preserved\nADMIN_PATH=/lower-priority-private\nJWT_SECRET=" +
        secret +
        "\n",
    );
    await writeFile(
      path.join(root, ".env.production.local"),
      'ADMIN_PATH="/production-private-panel"\n',
    );
    await writeFile(
      path.join(root, ".env.local"),
      'JWT_SECRET="' + secret + '"\nOTHER_KEY=keep-me\n',
    );
    await setupAdminEntry({
      root,
      environment: {},
      args: ["--path", entry, "--rotate-secret"],
    });
    const resolved = await inspectAdminEnvironment(root, {});
    assert.equal(resolved.values.ADMIN_PATH, entry);
    assert.equal(resolved.sources.ADMIN_PATH, ".env.production.local");
    assert.equal(resolved.sources.JWT_SECRET, ".env.local");
    assert.notEqual(resolved.values.JWT_SECRET, secret);
    assert.equal(
      parse(await readFile(path.join(root, ".env.local"), "utf8")).OTHER_KEY,
      "keep-me",
    );
    assert.equal(
      parse(await readFile(path.join(root, ".env"), "utf8")).SUPABASE_ANON_KEY,
      "preserved",
    );
    const overridden = await inspectAdminEnvironment(root, {
      JWT_SECRET: "e".repeat(48),
    });
    assert.equal(overridden.sources.JWT_SECRET, "окружение процесса");
  }));
test("check не создаёт файлы, валидирует конфигурацию и не раскрывает ключи", () =>
  temporary(async (root) => {
    await assert.rejects(
      () => setupAdminEntry({ root, environment: {}, args: ["--check"] }),
      /404/,
    );
    await assert.rejects(
      () => readFile(path.join(root, ".env")),
      (error) => error.code === "ENOENT",
    );
    await setupAdminEntry({ root, environment: {}, args: ["--path=" + entry] });
    const before = await readFile(path.join(root, ".env"), "utf8"),
      values = parse(before);
    const messages = await setupAdminEntry({
      root,
      environment: {},
      args: ["--check"],
    });
    assert.ok(messages.join("\n").includes("корректно"));
    assert.ok(!messages.join("\n").includes(values.JWT_SECRET));
    assert.equal(await readFile(path.join(root, ".env"), "utf8"), before);
  }));
test("повторный setup сохраняет ключи и существующий файловый JWT, режим разработки учитывается", () =>
  temporary(async (root) => {
    await mkdir(path.join(root, "data"));
    await writeFile(path.join(root, "data", "jwt.secret"), secret);
    await setupAdminEntry({ root, environment: {} });
    const before = parse(await readFile(path.join(root, ".env"), "utf8"));
    assert.equal(before.JWT_SECRET, secret);
    await setupAdminEntry({ root, environment: {} });
    assert.deepEqual(
      parse(await readFile(path.join(root, ".env"), "utf8")),
      before,
    );
    await writeFile(
      path.join(root, ".env.development.local"),
      `ADMIN_PATH=${entry}\n`,
    );
    assert.equal(
      (await inspectAdminEnvironment(root, {}, "development")).values
        .ADMIN_PATH,
      entry,
    );
  }));
test("ротация JWT не ломает локальные пароли молча", () =>
  temporary(async (root) => {
    await mkdir(path.join(root, "data"));
    await writeFile(
      path.join(root, "data", "admins.json"),
      '{"admins":[{"id":"test-only"}]}',
    );
    await setupAdminEntry({
      root,
      environment: {},
      args: [`JWT_SECRET=${secret}`],
    });
    const before = await readFile(path.join(root, ".env"), "utf8");
    await assert.rejects(
      () =>
        setupAdminEntry({ root, environment: {}, args: ["--rotate-secret"] }),
      /локальные ключи паролей/,
    );
    assert.equal(await readFile(path.join(root, ".env"), "utf8"), before);
  }));
test("адрес публичной страницы и длины ниже минимума не разрешаются", () =>
  temporary(async (root) => {
    for (const value of [
      "/admin",
      "/oplata-i-dostavka",
      "https://example.ru/private-admin-panel",
      "/short",
    ]) {
      await assert.rejects(
        () =>
          setupAdminEntry({
            root,
            environment: {},
            args: [`ADMIN_PATH=${value}`],
          }),
        /ADMIN_PATH/,
      );
    }
    assert.equal(
      adminEntry({ ADMIN_PATH: entry, JWT_SECRET: "x".repeat(31) }),
      null,
    );
    assert.equal(
      adminEntry({ ADMIN_PATH: entry, JWT_SECRET: "x".repeat(32) }),
      entry,
    );
  }));

test("Windows env: BOM, CRLF, export, кавычки и комментарии разбираются без dotenv", () => {
  const values = parse(
    `\uFEFFexport ADMIN_PATH="${entry}"\r\nJWT_SECRET='${secret}' # comment\r\n`,
  );
  assert.equal(values.ADMIN_PATH, entry);
  assert.equal(values.JWT_SECRET, secret);
});

test("поглощённые npm флаги не приводят к молчаливому setup без ротации", () =>
  temporary(async (root) => {
    await assert.rejects(
      () =>
        setupAdminEntry({
          root,
          environment: { npm_config_rotate_path: "true" },
          args: [],
        }),
      /npm поглотил флаги/,
    );
    await assert.rejects(
      () => readFile(path.join(root, ".env")),
      (error) => error.code === "ENOENT",
    );
    await setupAdminEntry({
      root,
      environment: { npm_config_rotate_path: "true" },
      args: ["--rotate-path", "--rotate-secret"],
    });
    assert.equal(
      adminEntry(
        parse(await readFile(path.join(root, ".env"), "utf8")),
      )?.startsWith("/"),
      true,
    );
  }));

test("реальный CLI работает в отдельной папке без node_modules и npm; проверка и ротация не раскрывают секреты", () =>
  temporary(async (root) => {
    await mkdir(path.join(root, "scripts"));
    await mkdir(path.join(root, "server"));
    await cp(
      new URL("./setup-admin-entry.mjs", import.meta.url),
      path.join(root, "scripts", "setup-admin-entry.mjs"),
    );
    await cp(
      new URL("../server/admin-gate.mjs", import.meta.url),
      path.join(root, "server", "admin-gate.mjs"),
    );
    const environment = { ...process.env };
    for (const key of Object.keys(environment))
      if (
        ["ADMIN_PATH", "JWT_SECRET"].includes(key) ||
        key.toLowerCase().startsWith("npm_config_")
      )
        delete environment[key];
    const run = (args) =>
      spawnSync(
        process.execPath,
        [path.join(root, "scripts", "setup-admin-entry.mjs"), ...args],
        { cwd: root, env: environment, encoding: "utf8" },
      );
    const first = run(["--rotate-path", "--rotate-secret"]);
    assert.equal(first.status, 0, first.stderr);
    const before = parse(await readFile(path.join(root, ".env"), "utf8"));
    assert.ok(adminEntry(before));
    assert.ok(!first.stdout.includes(before.JWT_SECRET));
    const checked = run(["--check"]);
    assert.equal(checked.status, 0, checked.stderr);
    assert.ok(!checked.stdout.includes(before.JWT_SECRET));
    const second = run(["--rotate-path", "--rotate-secret"]);
    assert.equal(second.status, 0, second.stderr);
    const after = parse(await readFile(path.join(root, ".env"), "utf8"));
    assert.notEqual(after.JWT_SECRET, before.JWT_SECRET);
    assert.notEqual(after.ADMIN_PATH, before.ADMIN_PATH);
  }));

test("npm alias содержит флаги в самом скрипте и не требует их проброса из PowerShell", async () => {
  const pkg = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  assert.equal(
    pkg.scripts["admin:rotate"],
    "node scripts/setup-admin-entry.mjs --rotate-path --rotate-secret",
  );
  assert.equal(pkg.dependencies.dotenv, undefined);
});

test("ручной env используется напрямую, без setup и без изменения файла", () =>
  temporary(async (root) => {
    const file = path.join(root, ".env"),
      text = `ADMIN_PATH=${entry}\r\nJWT_SECRET=${secret}\r\n`;
    await writeFile(file, text);
    const values = parse(await readFile(file, "utf8"));
    assert.equal(adminEntry(values), entry);
    const { createGateToken, verifyGateToken } =
      await import("../server/admin-gate.mjs");
    const token = await createGateToken(values.JWT_SECRET, adminEntry(values));
    assert.equal(
      await verifyGateToken(token, values.JWT_SECRET, adminEntry(values)),
      true,
    );
    assert.equal(await readFile(file, "utf8"), text);
    const updated = {
      ADMIN_PATH: "/another-private-panel",
      JWT_SECRET: "n".repeat(48),
    };
    await writeFile(
      file,
      `ADMIN_PATH=${updated.ADMIN_PATH}\nJWT_SECRET=${updated.JWT_SECRET}\n`,
    );
    const reloaded = parse(await readFile(file, "utf8"));
    assert.equal(adminEntry(reloaded), updated.ADMIN_PATH);
    assert.equal(
      await verifyGateToken(token, reloaded.JWT_SECRET, adminEntry(reloaded)),
      false,
    );
  }));
