import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { authenticateSupabaseAdmin } from "../server/admin-login.mjs";
import { createSupabaseFetch } from "../server/supabase-fetch.mjs";
const valid = {
  data: {
    user: { id: "test-user" },
    session: { access_token: "test-access", refresh_token: "test-refresh" },
  },
};
function fixture({
  auth = valid,
  membership = { data: { user_id: "test-user", role: "owner" } },
  authThrows = false,
  dbThrows = false,
  logoutThrows = false,
} = {}) {
  const calls = { auth: 0, db: 0, logout: 0 };
  const query = {
    select(value) {
      assert.equal(value, "user_id,role");
      return this;
    },
    eq(key, id) {
      assert.equal(key, "user_id");
      assert.equal(id, "test-user");
      return this;
    },
    async maybeSingle() {
      if (dbThrows) throw Error("offline");
      return membership;
    },
  };
  return {
    calls,
    options: {
      email: "test@example.ru",
      password: "test-password",
      client: {
        auth: {
          async signInWithPassword() {
            calls.auth++;
            if (authThrows) throw Error("offline");
            return auth;
          },
        },
      },
      userClient(token) {
        calls.db++;
        assert.equal(token, "test-access");
        return {
          from(table) {
            assert.equal(table, "admin_users");
            return query;
          },
        };
      },
      async discardSession(token) {
        calls.logout++;
        assert.equal(token, "test-access");
        if (logoutThrows) throw Error("offline");
      },
    },
  };
}
for (const role of ["admin", "owner"])
  test(`вход с подтверждёнными данными и ролью ${role}`, async () => {
    const f = fixture({ membership: { data: { user_id: "test-user", role } } }),
      result = await authenticateSupabaseAdmin(f.options);
    assert.equal(result.ok, true);
    assert.equal(result.role, role);
    assert.equal(result.access, "test-access");
    assert.equal(f.calls.logout, 0);
  });
for (const [code, status, output] of [
  ["invalid_credentials", 401, "INVALID_CREDENTIALS"],
  ["email_not_confirmed", 401, "EMAIL_NOT_CONFIRMED"],
  ["user_banned", 403, "ACCOUNT_DISABLED"],
  ["over_request_rate_limit", 429, "AUTH_RATE_LIMIT"],
  ["email_provider_disabled", 503, "EMAIL_LOGIN_DISABLED"],
])
  test(`ошибка Auth ${code} видна без проверки прав и без токенов`, async () => {
    const f = fixture({ auth: { data: {}, error: { code } } }),
      result = await authenticateSupabaseAdmin(f.options);
    assert.equal(result.ok, false);
    assert.equal(result.status, status);
    assert.equal(result.code, output);
    assert.equal(f.calls.db, 0);
    assert.equal(result.access, undefined);
    assert.equal(result.refresh, undefined);
  });
test("пользователь Authentication без admin_users получает понятный отказ, а не автоматические права", async () => {
  const f = fixture({ membership: { data: null } }),
    result = await authenticateSupabaseAdmin(f.options);
  assert.equal(result.status, 403);
  assert.equal(result.code, "ADMIN_ACCESS_MISSING");
  assert.match(result.error, /user_id/);
  assert.equal(f.calls.logout, 1);
  assert.equal(result.access, undefined);
});
test("отсутствие миграции роли не маскируется ошибкой пароля", async () => {
  const f = fixture({
      membership: {
        error: { code: "42703", message: "RAW PRIVATE DATABASE ERROR" },
      },
      logoutThrows: true,
    }),
    result = await authenticateSupabaseAdmin(f.options);
  assert.equal(result.status, 503);
  assert.equal(result.code, "ADMIN_SCHEMA_MISSING");
  assert.ok(!JSON.stringify(result).includes("RAW PRIVATE"));
});
test("недоступность проверки прав не отключает RLS и не пропускает пользователя", async () => {
  const f = fixture({ dbThrows: true }),
    result = await authenticateSupabaseAdmin(f.options);
  assert.equal(result.status, 503);
  assert.equal(result.code, "ADMIN_MEMBERSHIP_UNAVAILABLE");
  assert.equal(f.calls.logout, 1);
});
test("Auth недоступен или выдал неполную сессию: отказ без проверки БД", async () => {
  for (const options of [
    { authThrows: true },
    { auth: { data: { user: { id: "test-user" } } } },
  ]) {
    const f = fixture(options),
      result = await authenticateSupabaseAdmin(f.options);
    assert.equal(result.status, 503);
    assert.equal(f.calls.db, 0);
  }
});
test("неверный ключ проекта не выдаётся за неверный пароль и не попадает в ответ", async () => {
  const f = fixture({
      auth: { error: { message: "Invalid API key: PRIVATE_VALUE" } },
    }),
    result = await authenticateSupabaseAdmin(f.options);
  assert.equal(result.code, "SUPABASE_CONFIG");
  assert.ok(!JSON.stringify(result).includes("PRIVATE_VALUE"));
});
test("Supabase fetch сохраняет заголовки и прерывается по дедлайну", async () => {
  const hold = setTimeout(() => {}, 1000);
  try {
    const fetcher = createSupabaseFetch(
      async (_input, init) =>
        new Promise((_resolve, reject) => {
          assert.equal(init.headers.authorization, "Bearer fixture-token");
          init.signal.addEventListener(
            "abort",
            () => reject(init.signal.reason),
            { once: true },
          );
        }),
      10,
    );
    await assert.rejects(
      () =>
        fetcher("https://example.test", {
          headers: { authorization: "Bearer fixture-token" },
        }),
      (error) => error.name === "TimeoutError",
    );
  } finally {
    clearTimeout(hold);
  }
});
test("Supabase fetch уважает отмену вызывающего кода", async () => {
  const controller = new AbortController();
  controller.abort();
  const fetcher = createSupabaseFetch(async (_input, init) => {
    assert.equal(init.signal.aborted, true);
    return new Response("{}");
  });
  await fetcher("https://example.test", { signal: controller.signal });
});
test("форма не открывает панель без подтверждённой сессии, ошибки каталога видны в панели", async () => {
  const page = await readFile(
    new URL("../app/admin/page.tsx", import.meta.url),
    "utf8",
  );
  assert.match(page, /session.ok !== true/);
  assert.match(page, /Вход выполнен, но каталог не загрузился/);
  assert.match(page, /id="login-error"[^>]*role="alert"/);
  const api = await readFile(
    new URL("../components/admin/api.ts", import.meta.url),
    "utf8",
  );
  assert.match(api, /INVALID_RESPONSE/);
  assert.match(api, /REQUEST_TIMEOUT/);
});

for (const [message, code] of [
  ["Email not confirmed", "EMAIL_NOT_CONFIRMED"],
  ["Invalid login credentials", "INVALID_CREDENTIALS"],
])
  test("legacy Auth без кода: " + message, async () => {
    const f = fixture({ auth: { error: { message, status: 400 } } }),
      result = await authenticateSupabaseAdmin(f.options);
    assert.equal(result.code, code);
    assert.equal(result.status, 401);
  });
