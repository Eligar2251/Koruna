import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  writeFile,
  readFile,
  rm,
  mkdir,
  stat,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { parse } from "dotenv";
import {
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
