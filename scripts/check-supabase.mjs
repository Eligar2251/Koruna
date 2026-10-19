import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { readSupabaseConfig } from "../server/supabase-config.mjs";
import { createSupabaseFetch } from "../server/supabase-fetch.mjs";
import { readSettingsConfig } from "../server/supabase-read.mjs";
import { createSupabaseStore } from "../server/store.mjs";
import { SupabaseDataError } from "../server/supabase-errors.mjs";

export async function checkSupabase(
  env = process.env,
  fetcher = globalThis.fetch,
) {
  let remote;
  try {
    remote = readSupabaseConfig(env);
  } catch {
    return {
      ok: false,
      checks: [
        {
          name: "конфигурация",
          ok: false,
          code: "SUPABASE_CONFIG",
          message:
            "Проверьте SUPABASE_URL и SUPABASE_ANON_KEY: нужны URL проекта и anon / publishable key.",
        },
      ],
    };
  }
  if (!remote)
    return {
      ok: false,
      checks: [
        {
          name: "конфигурация",
          ok: false,
          code: "SUPABASE_NOT_CONFIGURED",
          message:
            "Supabase не подключён: обе переменные пусты или содержат пример.",
        },
      ],
    };
  const client = createClient(remote.url, remote.key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: createSupabaseFetch(fetcher) },
  });
  const results = await Promise.allSettled([
    readSettingsConfig(client),
    createSupabaseStore(client).catalog(),
  ]);
  const checks = results.map((result, index) =>
    result.status === "fulfilled"
      ? { name: index ? "каталог" : "настройки", ok: true }
      : {
          name: index ? "каталог" : "настройки",
          ok: false,
          code:
            result.reason instanceof SupabaseDataError
              ? result.reason.code
              : "SUPABASE_CHECK_FAILED",
          message:
            result.reason instanceof SupabaseDataError
              ? result.reason.message
              : "Не удалось выполнить проверку; подробности скрыты для защиты ключей.",
        },
  );
  return { ok: checks.every((check) => check.ok), checks };
}
async function main() {
  const mode = process.argv[2] || "development";
  if (!["development", "production"].includes(mode))
    throw new Error("Режим проверки: development или production.");
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  // Use the very same env loader/expansion/precedence as the installed Next.js.
  const require = createRequire(import.meta.url);
  const { loadEnvConfig } = require(
    require.resolve("@next/env", {
      paths: [require.resolve("next/package.json")],
    }),
  );
  loadEnvConfig(root, mode === "development", {
    info() {},
    error() {
      throw new Error("Ошибка чтения env-файлов.");
    },
  });
  const result = await checkSupabase();
  console.log(
    `Supabase: проверка ${mode}, только чтение. Ключи, токены и данные клиентов не выводятся.`,
  );
  console.log(
    "Приоритет: окружение процесса → .env." +
      mode +
      ".local → .env.local → .env." +
      mode +
      " → .env.",
  );
  for (const check of result.checks)
    console.log(
      `${check.ok ? "OK" : "ОШИБКА"}: ${check.name}${check.ok ? "" : ` [${check.code}] ${check.message}`}`,
    );
  process.exitCode = result.ok ? 0 : 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch(() => {
    console.error(
      "Не удалось запустить проверку. Проверьте режим, env-файлы и установку зависимостей. Секретные значения скрыты.",
    );
    process.exitCode = 1;
  });
