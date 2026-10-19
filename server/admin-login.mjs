/** @typedef {{ok:false,status:number,code:string,error:string} | {ok:true,access:string,refresh:string,role:"admin"|"owner"}} LoginResult */
/** @returns {{ok:false,status:number,code:string,error:string}} */
const refused = (status, code, error) => ({ ok: false, status, code, error });
export function supabaseLoginError(error) {
  let code = String(error?.code || "");
  // Older/self-hosted GoTrue responses may omit the API version header and SDK error code.
  if (!code) {
    const message = String(error?.message || "");
    if (/email.*not confirmed/i.test(message)) code = "email_not_confirmed";
    else if (/invalid (?:login )?credentials/i.test(message))
      code = "invalid_credentials";
    else if (/user.*banned/i.test(message)) code = "user_banned";
  }
  if (code === "email_not_confirmed")
    return refused(
      401,
      "EMAIL_NOT_CONFIRMED",
      "Подтвердите почту пользователя в Supabase → Authentication → Users, затем повторите вход.",
    );
  if (code === "user_banned")
    return refused(
      403,
      "ACCOUNT_DISABLED",
      "Вход для этой учётной записи отключён. Проверьте пользователя в Authentication.",
    );
  if (error?.status === 429 || code === "over_request_rate_limit")
    return refused(
      429,
      "AUTH_RATE_LIMIT",
      "Supabase ограничил попытки входа. Подождите и попробуйте позже.",
    );
  if (code === "invalid_credentials" || code === "invalid_grant")
    return refused(
      401,
      "INVALID_CREDENTIALS",
      "Неверная почта или пароль. Нужен пользователь Authentication именно того проекта, который указан в SUPABASE_URL.",
    );
  if (code === "email_provider_disabled")
    return refused(
      503,
      "EMAIL_LOGIN_DISABLED",
      "В проекте Supabase отключён вход по email и паролю. Проверьте Authentication → Sign In / Providers.",
    );
  if (/invalid api key|invalid.*apikey/i.test(String(error?.message || "")))
    return refused(
      503,
      "SUPABASE_CONFIG",
      "Supabase отклонил ключ проекта. Проверьте, что SUPABASE_URL и SUPABASE_ANON_KEY принадлежат одному проекту, затем перезапустите сайт.",
    );
  return refused(
    503,
    "AUTH_UNAVAILABLE",
    "Не удалось выполнить авторизацию Supabase. Проверьте SUPABASE_URL, ключ проекта и доступность Supabase с сервера.",
  );
}

/** @returns {Promise<LoginResult>} */
export async function authenticateSupabaseAdmin({
  email,
  password,
  client,
  userClient,
  discardSession = async (_access) => {},
}) {
  let signed;
  try {
    signed = await client.auth.signInWithPassword({ email, password });
  } catch {
    return supabaseLoginError(null);
  }
  if (signed.error) return supabaseLoginError(signed.error);
  const session = signed.data?.session,
    user = signed.data?.user;
  if (!session?.access_token || !session.refresh_token || !user?.id)
    return refused(
      503,
      "AUTH_SESSION_MISSING",
      "Supabase не выдал сессию. Проверьте подтверждение почты и настройки входа в Authentication.",
    );
  let membership;
  try {
    membership = await userClient(session.access_token)
      .from("admin_users")
      .select("user_id,role")
      .eq("user_id", user.id)
      .maybeSingle();
  } catch {
    membership = { error: { code: "unavailable" } };
  }
  let failure;
  if (membership.error) {
    const code = String(membership.error.code || "");
    failure = ["42P01", "42703", "PGRST204", "PGRST205"].includes(code)
      ? refused(
          503,
          "ADMIN_SCHEMA_MISSING",
          "Почта и пароль приняты, но схема админки не готова. Проверьте добавочные миграции, включая 20261017170000_staff_roles_mail.sql; очистку БД повторять не нужно.",
        )
      : refused(
          503,
          "ADMIN_MEMBERSHIP_UNAVAILABLE",
          "Почта и пароль приняты, но права администратора проверить не удалось. Проверьте доступность БД и миграции RLS для public.admin_users. Не отключайте RLS.",
        );
  } else if (
    !membership.data ||
    !["admin", "owner"].includes(membership.data.role)
  ) {
    failure = refused(
      403,
      "ADMIN_ACCESS_MISSING",
      "Почта и пароль приняты, но доступ к панели не назначен. В Table Editor → public.admin_users добавьте User UID этого пользователя в user_id и роль owner или admin. Строка в Authentication сама по себе доступ не даёт. Если user_id уже добавлен, проверьте миграции и политики RLS.",
    );
  }
  if (failure) {
    try {
      await discardSession(session.access_token);
    } catch {
      /* A discarded session is never sent to the browser. */
    }
    return failure;
  }
  return {
    ok: true,
    access: session.access_token,
    refresh: session.refresh_token,
    role: membership.data.role,
  };
}
