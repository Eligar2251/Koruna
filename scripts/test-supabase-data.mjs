import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  supabaseDataError,
  SupabaseDataError,
} from "../server/supabase-errors.mjs";
import { readSettingsConfig, readSupabase } from "../server/supabase-read.mjs";
import { createSupabaseStore } from "../server/store.mjs";
import { createSupabaseFetch } from "../server/supabase-fetch.mjs";
import { checkSupabase } from "./check-supabase.mjs";

const sensitive = "PRIVATE_TOKEN_DO_NOT_PRINT";
test("ошибки чтения различаются и никогда не раскрывают сырые ответы или ключи", () => {
  for (const [error, status, expected, http] of [
    [
      { message: `Invalid API key: ${sensitive}` },
      401,
      "SUPABASE_KEY_INVALID",
      503,
    ],
    [
      { code: "42P01", message: sensitive },
      404,
      "SUPABASE_SCHEMA_MISSING",
      503,
    ],
    [
      { code: "42703", message: sensitive },
      400,
      "SUPABASE_SCHEMA_MISSING",
      503,
    ],
    [{ code: "42501", message: sensitive }, 403, "SUPABASE_FORBIDDEN", 403],
    [{ code: "PGRST301", message: sensitive }, 401, "SUPABASE_AUTH", 401],
    [
      {
        message: `TypeError: fetch failed ${sensitive}`,
        cause: { code: "ENOTFOUND" },
      },
      0,
      "SUPABASE_DNS",
      503,
    ],
    [
      { message: `TimeoutError: aborted ${sensitive}` },
      0,
      "SUPABASE_TIMEOUT",
      503,
    ],
    [
      { message: `unable to verify certificate ${sensitive}` },
      0,
      "SUPABASE_TLS",
      503,
    ],
    [
      { message: `TypeError: fetch failed ${sensitive}` },
      0,
      "SUPABASE_UNAVAILABLE",
      503,
    ],
    [{ message: sensitive }, 502, "SUPABASE_UNAVAILABLE", 503],
    [{ message: sensitive }, 400, "SUPABASE_QUERY_FAILED", 503],
  ]) {
    const mapped = supabaseDataError(error, "settings", status);
    assert.ok(mapped instanceof SupabaseDataError);
    assert.equal(mapped.code, expected);
    assert.equal(mapped.status, http);
    assert.ok(!mapped.stack.includes(sensitive));
    assert.ok(!JSON.stringify(mapped).includes(sensitive));
    if (expected !== "SUPABASE_SCHEMA_MISSING")
      assert.ok(!mapped.message.includes("Примените миграцию"));
  }
});
test("временный сбой чтения повторяется один раз с новым сигналом", async () => {
  const signals = [];
  const result = await readSupabase(async (signal) => {
    signals.push(signal);
    return signals.length === 1
      ? { error: { message: "fetch failed" }, status: 0 }
      : { data: ["ok"], error: null, status: 200 };
  });
  assert.deepEqual(result.data, ["ok"]);
  assert.equal(signals.length, 2);
  assert.notEqual(signals[0], signals[1]);
  let attempts = 0;
  const failed = await readSupabase(async () => {
    attempts++;
    throw new TypeError("fetch failed");
  });
  assert.equal(attempts, 2);
  assert.ok(failed.error);
});
test("ошибки ключа, схемы и доступа не повторяются", async () => {
  for (const error of [
    { message: "Invalid API key" },
    { code: "42P01" },
    { code: "42501" },
    { code: "PGRST301" },
    { message: "certificate verification failed" },
  ]) {
    let attempts = 0;
    await readSupabase(async () => {
      attempts++;
      return { error };
    });
    assert.equal(attempts, 1);
  }
});
function settingsClient(result) {
  const query = {
    select() {
      return this;
    },
    eq() {
      return this;
    },
    abortSignal() {
      return this;
    },
    async maybeSingle() {
      return result;
    },
  };
  return {
    from(name) {
      assert.equal(name, "site_settings");
      return query;
    },
  };
}
test("настройки: отсутствующая строка не подменяется пустыми настройками, сеть — не миграцией", async () => {
  await assert.rejects(
    () => readSettingsConfig(settingsClient({ data: null, error: null })),
    (e) => e.code === "SUPABASE_SETTINGS_MISSING",
  );
  await assert.rejects(
    () =>
      readSettingsConfig(
        settingsClient({ error: { message: "fetch failed" } }),
      ),
    (e) => e.code === "SUPABASE_UNAVAILABLE",
  );
  const config = { requestsEnabled: true, revision: "test" };
  assert.deepEqual(
    await readSettingsConfig(settingsClient({ data: { config } })),
    config,
  );
});
test("каталог: сбой чтения не называется сохранением; политика доступа не обходится", async () => {
  let calls = 0;
  const query = {
    select() {
      return this;
    },
    eq() {
      return this;
    },
    order() {
      return this;
    },
    abortSignal() {
      calls++;
      return Promise.resolve({ error: { message: "fetch failed" }, status: 0 });
    },
  };
  await assert.rejects(
    () =>
      createSupabaseStore({
        from() {
          return query;
        },
      }).catalog(),
    (e) =>
      e.code === "SUPABASE_UNAVAILABLE" && !e.message.includes("сохранить"),
  );
  assert.equal(calls, 4);
});
test("fetch Supabase никогда не наследует HTTP-кеш Next.js, но сохраняет токен/метод", async () => {
  await createSupabaseFetch(async (_input, init) => {
    assert.equal(init.cache, "no-store");
    assert.equal(init.method, "POST");
    assert.equal(init.headers.authorization, "Bearer fixture");
    return Response.json({ ok: true });
  })("https://fixture.test", {
    cache: "force-cache",
    method: "POST",
    headers: { authorization: "Bearer fixture" },
  });
});
test("необязательная диагностика проверяет настройки и каталог через настоящий SDK, только GET", async () => {
  const calls = [];
  const env = {
    SUPABASE_URL: "https://fixture.test",
    SUPABASE_ANON_KEY: "fixture-anon",
  };
  const result = await checkSupabase(env, async (url, init) => {
    const route = new URL(url).pathname;
    calls.push(route);
    assert.ok(!init.method || init.method === "GET");
    assert.equal(init.cache, "no-store");
    return Response.json(
      route.endsWith("site_settings")
        ? [{ config: { requestsEnabled: true } }]
        : [],
    );
  });
  assert.equal(result.ok, true);
  assert.equal(calls.length, 3);
  assert.equal(result.checks.length, 2);
  assert.ok(!JSON.stringify(result).includes("fixture-anon"));
  const refused = await checkSupabase(env, async () =>
    Response.json({ message: `Invalid API key ${sensitive}` }, { status: 401 }),
  );
  assert.equal(refused.ok, false);
  assert.ok(refused.checks.every((c) => c.code === "SUPABASE_KEY_INVALID"));
  assert.ok(!JSON.stringify(refused).includes(sensitive));
});
test("API сохраняет безопасный код ошибки, а повторяющий механизм не применяется к записи", async () => {
  const http = await readFile(
    new URL("../lib/http.ts", import.meta.url),
    "utf8",
  );
  assert.match(http, /err instanceof SupabaseDataError/);
  assert.match(http, /code: err.code/);
  const requests = await readFile(
    new URL("../lib/requests.ts", import.meta.url),
    "utf8",
  );
  assert.ok(!requests.includes("readSupabase"));
  const settings = await readFile(
    new URL("../lib/settings.ts", import.meta.url),
    "utf8",
  );
  assert.ok(!settings.includes("Примените миграцию 20261017160000"));
});

test("SDK не умножает повторные попытки; DNS-причина из details остаётся диагностируемой", async () => {
  const env = {
    SUPABASE_URL: "https://fixture.test",
    SUPABASE_ANON_KEY: "fixture-anon",
  };
  let calls = 0;
  const down = await checkSupabase(env, async () => {
    calls++;
    return Response.json({ message: "upstream unavailable" }, { status: 503 });
  });
  assert.equal(calls, 6); // Three reads, exactly two HTTP attempts per read.
  assert.ok(
    down.checks.every((check) => check.code === "SUPABASE_UNAVAILABLE"),
  );
  calls = 0;
  const dns = await checkSupabase(env, async () => {
    calls++;
    throw new TypeError("fetch failed", {
      cause: Object.assign(
        new Error("DNS failure PRIVATE_TOKEN_DO_NOT_PRINT"),
        { code: "ENOTFOUND" },
      ),
    });
  });
  assert.equal(calls, 6);
  assert.ok(dns.checks.every((check) => check.code === "SUPABASE_DNS"));
  assert.ok(!JSON.stringify(dns).includes("PRIVATE_TOKEN_DO_NOT_PRINT"));
});
