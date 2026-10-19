import { randomBytes } from "node:crypto";
import { readFile, writeFile, chmod } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { parseEnv } from "node:util";
import { adminConfigurationErrors } from "../server/admin-gate.mjs";

export function parseAdminEnv(text) {
  // UTF-8 BOM is common in Windows-created .env files; Node's parser keeps it in the first key.
  return parseEnv(text.replace(/^\uFEFF/, ""));
}
const parse = parseAdminEnv;
const KEYS = ["ADMIN_PATH", "JWT_SECRET"];
const HELP = `Необязательная утилита: можно просто заполнить ADMIN_PATH/JWT_SECRET в .env и перезапустить сайт.
Настройка закрытой панели (значения секретов не выводятся).
  npm run admin:setup
  npm run admin:rotate
  node scripts/setup-admin-entry.mjs --rotate-path --rotate-secret
  node scripts/setup-admin-entry.mjs --path /your-new-private-panel --rotate-secret
  npm run admin:setup -- ADMIN_PATH=/your-new-private-panel
  npm run admin:check

Для Windows/PowerShell используйте admin:rotate или прямой запуск node: npm может поглотить флаги.
KEY=VALUE после команды и переменные окружения перед npm поддерживаются.
Не передавайте JWT_SECRET аргументом: он останется в истории shell и выводе npm.
--rotate-path         сгенерировать новый случайный путь
--rotate-secret       сгенерировать новый случайный JWT-ключ
--mode development    проверять dev-окружение (по умолчанию production)
--check               только проверить эффективные значения, файлы не менять
--allow-local-password-reset  разрешить смену JWT с последующим сбросом локальных паролей

ADMIN_PATH: / и 16–128 URL-safe символов. JWT_SECRET: минимум 32 символа.
После изменения env пересоберите сайт и перезапустите сервер/PM2/контейнер.
Внешнее окружение хостинга имеет приоритет над .env-файлами.`;

export function parseOptions(args) {
  const result = {
    values: {},
    mode: "production",
    check: false,
    rotatePath: false,
    rotateSecret: false,
    allowLocalReset: false,
    help: false,
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--") continue;
    if (arg === "--help" || arg === "-h") result.help = true;
    else if (arg === "--check") result.check = true;
    else if (arg === "--rotate-path") result.rotatePath = true;
    else if (arg === "--rotate-secret") result.rotateSecret = true;
    else if (arg === "--allow-local-password-reset")
      result.allowLocalReset = true;
    else if (arg === "--mode") result.mode = args[++i];
    else if (arg === "--path" || arg.startsWith("--path=")) {
      const value = arg === "--path" ? args[++i] : arg.slice(7);
      if (
        !value ||
        value.startsWith("--") ||
        result.values.ADMIN_PATH !== undefined
      )
        throw new Error(
          "Укажите ADMIN_PATH один раз: --path /your-new-private-panel",
        );
      result.values.ADMIN_PATH = value;
    } else {
      const match = /^(ADMIN_PATH|JWT_SECRET)=(.*)$/.exec(arg);
      if (!match)
        throw new Error(
          "Неизвестный аргумент. Используйте node scripts/setup-admin-entry.mjs --help; файлы не изменены.",
        );
      if (result.values[match[1]] !== undefined)
        throw new Error("Значение ключа указано дважды; файлы не изменены.");
      result.values[match[1]] = match[2];
    }
  }
  if (!["production", "development"].includes(result.mode))
    throw new Error("--mode: production или development");
  if (
    (result.rotatePath && result.values.ADMIN_PATH !== undefined) ||
    (result.rotateSecret && result.values.JWT_SECRET !== undefined)
  )
    throw new Error(
      "Нельзя одновременно передать значение ключа и запросить его генерацию.",
    );
  if (
    result.check &&
    (result.rotatePath ||
      result.rotateSecret ||
      Object.keys(result.values).length)
  )
    throw new Error(
      "--check только проверяет настройки; не передавайте новые значения.",
    );
  return result;
}

async function readOptional(file) {
  try {
    return (await readFile(file, "utf8")).replace(/^\uFEFF/, "");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}
export async function inspectAdminEnvironment(
  root,
  environment = process.env,
  mode = "production",
) {
  // Match Next.js file precedence without printing or copying unrelated secrets.
  const names = [`.env.${mode}.local`, ".env.local", `.env.${mode}`, ".env"];
  const files = await Promise.all(
    names.map(async (name) => ({
      name,
      text: await readOptional(path.join(root, name)),
    })),
  );
  const values = {},
    sources = {};
  for (const file of files) {
    const parsed = parse(file.text);
    for (const key of KEYS)
      if (values[key] === undefined && parsed[key] !== undefined) {
        values[key] = parsed[key];
        sources[key] = file.name;
      }
  }
  for (const key of KEYS)
    if (environment[key] !== undefined) {
      values[key] = environment[key];
      sources[key] = "окружение процесса";
    }
  return { files, values, sources };
}
function serializeValue(value) {
  // Avoid dotenv-expand silently changing a secret when Next.js loads it.
  if (/[\r\n$]/.test(value))
    throw new Error(
      "ADMIN_PATH/JWT_SECRET задаются напрямую, без переводов строк и подстановок $VAR. Используйте генерацию ключа.",
    );
  return JSON.stringify(value);
}
export async function setupAdminEntry({
  root,
  args = [],
  environment = process.env,
}) {
  const options = parseOptions(args);
  if (options.help) return [HELP];
  if (!options.check) {
    for (const flag of [
      "rotate-path",
      "rotate-secret",
      "allow-local-password-reset",
      "path",
      "mode",
    ]) {
      const configured =
        environment["npm_config_" + flag.replaceAll("-", "_")] ??
        environment["npm_config_" + flag];
      if (
        configured !== undefined &&
        configured !== "false" &&
        configured !== "0" &&
        !args.some(
          (arg) => arg === "--" + flag || arg.startsWith("--" + flag + "="),
        )
      )
        throw new Error(
          "npm поглотил флаги и не передал их скрипту. Файлы не изменены. Используйте npm run admin:rotate или node scripts/setup-admin-entry.mjs --rotate-path --rotate-secret.",
        );
    }
  }
  const inspected = await inspectAdminEnvironment(
    root,
    environment,
    options.mode,
  );
  const { files, sources } = inspected;
  const current = inspected.values;
  if (options.check) {
    const errors = adminConfigurationErrors(current);
    if (errors.length)
      throw new Error(
        errors.join("\n") +
          "\nПанель закрыта (404). Исправьте настройки и перезапустите сайт.",
      );
    for (const key of KEYS) serializeValue(current[key]);
    return KEYS.map(
      (key) => `${key}: корректно; источник — ${sources[key]}`,
    ).concat(
      "Конфигурация корректна. Это проверка файлов/окружения CLI, а не уже запущенного сервера. После изменений перезапустите сайт; /admin по-прежнему возвращает 404.",
    );
  }
  const oldFileKey = (
    await readOptional(path.join(root, "data", "jwt.secret"))
  ).trim();
  const next = {
    ADMIN_PATH:
      options.values.ADMIN_PATH ??
      (options.rotatePath
        ? "/" + randomBytes(32).toString("base64url")
        : current.ADMIN_PATH || "/" + randomBytes(32).toString("base64url")),
    JWT_SECRET:
      options.values.JWT_SECRET ??
      (options.rotateSecret
        ? randomBytes(48).toString("base64url")
        : current.JWT_SECRET ||
          oldFileKey ||
          randomBytes(48).toString("base64url")),
  };
  const errors = adminConfigurationErrors(next);
  if (errors.length)
    throw new Error(errors.join("\n") + "\nФайлы не изменены.");
  for (const key of KEYS) {
    serializeValue(next[key]);
    if (environment[key] !== undefined && environment[key] !== next[key])
      throw new Error(
        `${key} задан во внешнем окружении и перекрывает файлы. Измените его в настройках хостинга/службы или уберите экспорт из shell. Файлы не изменены.`,
      );
  }
  const oldSecret = current.JWT_SECRET || oldFileKey;
  const changingKey = !!oldSecret && oldSecret !== next.JWT_SECRET;
  const accounts = JSON.parse(
    (await readOptional(path.join(root, "data", "admins.json"))) ||
      '{"admins":[]}',
  );
  if (changingKey && accounts.admins?.length && !options.allowLocalReset)
    throw new Error(
      "Смена JWT_SECRET сделает локальные ключи паролей недействительными. Файлы не изменены. Сохраните резервную копию; для осознанной ротации добавьте --allow-local-password-reset, затем восстановите пароли через npm run admin:create -- --reset. На пароли Supabase Auth это не влияет.",
    );
  const edited = new Set();
  // Update the file actually used by Next.js, not an ignored lower-priority .env.
  for (const key of KEYS) {
    let target =
      files.find((file) => parse(file.text)[key] !== undefined) ||
      files.find((file) => file.name === ".env");
    const replacement = `${key}=${serializeValue(next[key])}`;
    const pattern = new RegExp(
      `^[ \\t]*(?:export[ \\t]+)?${key}[ \\t]*=.*$`,
      "gm",
    );
    if (pattern.test(target.text)) {
      let replaced = false;
      target.text = target.text.replace(pattern, () => {
        if (replaced) return "";
        replaced = true;
        return replacement;
      });
    } else
      target.text = target.text.replace(/\s*$/, "") + "\n" + replacement + "\n";
    edited.add(target.name);
  }
  for (const name of edited) {
    const file = files.find((file) => file.name === name);
    await writeFile(path.join(root, name), file.text, { mode: 0o600 });
    await chmod(path.join(root, name), 0o600);
  }
  const messages = [
    `ADMIN_PATH и JWT_SECRET проверены и сохранены (${[...edited].join(", ")}). Значения не выводятся.`,
    "Пересоберите сайт и перезапустите сервер/PM2/контейнер. Открывайте свой домен + ADMIN_PATH, не /admin.",
    "Проверьте конфигурацию: npm run admin:check. На хостинге задайте те же значения в его переменных окружения.",
  ];
  if (changingKey && accounts.admins?.length)
    messages.push(
      "JWT_SECRET изменён: сбросьте локальные пароли через npm run admin:create -- --reset. Supabase Auth не затронут.",
    );
  return messages;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  try {
    const messages = await setupAdminEntry({
      root: fileURLToPath(new URL("../", import.meta.url)),
      args: process.argv.slice(2),
    });
    messages.forEach((message) => console.log(message));
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Не удалось настроить панель",
    );
    process.exitCode = 1;
  }
}
