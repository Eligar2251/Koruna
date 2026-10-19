import { authenticateSupabaseAdmin } from "../../../../server/admin-login.mjs";
import {
  hasAdminGate,
  configuredSupabase,
  ensureLocalAdmin,
  hasSiteHeader,
  loginAllowed,
  setSession,
  signAccess,
  supabaseClient,
} from "../../../../lib/auth";
import { fail, json, readJson } from "../../../../lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await hasAdminGate(req))) return json({ error: "Не найдено" }, 404);
  if (!hasSiteHeader(req))
    return json(
      {
        error:
          "Запрос на вход отклонён. Откройте секретный адрес на основном домене сайта и повторите попытку.",
        code: "REQUEST_REJECTED",
      },
      403,
    );
  try {
    const body = await readJson(req, 4096);
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    if (!loginAllowed(req, email))
      return json({ error: "Слишком много попыток. Подождите" }, 429);
    if (!email || !password || email.length > 200 || password.length > 200) {
      return json({ error: "Неверная почта или пароль" }, 401);
    }
    const remote = configuredSupabase();
    if (!remote) {
      const book = await ensureLocalAdmin();
      const account = await book.authenticate(email, password);
      if (!account)
        return json(
          {
            error:
              "Неверная почта или пароль локального администратора. Для входа пользователем Supabase задайте SUPABASE_URL и SUPABASE_ANON_KEY в серверном env и перезапустите сайт.",
            code: "LOCAL_LOGIN_FAILED",
          },
          401,
        );
      const access = signAccess(account);
      return setSession(
        json({ ok: true, mode: "file", role: account.role }),
        access,
        access,
        req,
      );
    }
    const client = supabaseClient();
    if (!client)
      return json({ error: "Задайте SUPABASE_URL и SUPABASE_ANON_KEY" }, 503);
    const result = await authenticateSupabaseAdmin({
      email,
      password,
      client,
      userClient: supabaseClient,
      discardSession: async (access: string) => {
        await fetch(`${remote.url}/auth/v1/logout`, {
          method: "POST",
          headers: { apikey: remote.key, authorization: `Bearer ${access}` },
          signal: AbortSignal.timeout(2000),
        });
      },
    });
    if (!result.ok)
      return json({ error: result.error, code: result.code }, result.status);
    return setSession(
      json({ ok: true, mode: "supabase", role: result.role }),
      result.access,
      result.refresh,
      req,
    );
  } catch (err) {
    return fail(err);
  }
}
