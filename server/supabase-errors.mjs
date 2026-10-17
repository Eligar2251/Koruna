const resources = {
  settings: "настройки сайта",
  catalog: "каталог",
  data: "данные",
};
export class SupabaseDataError extends Error {
  constructor(code, message, status = 503) {
    super(message);
    this.name = "SupabaseDataError";
    this.code = code;
    this.status = status;
  }
}

// Never return SDK messages, request URLs, headers or nested causes to the browser/log.
export function supabaseDataError(
  error,
  resource = "data",
  status = 0,
  operation = "read",
) {
  const text = [
    error?.name,
    error?.code,
    error?.message,
    error?.details,
    error?.cause?.code,
    error?.cause?.message,
  ]
    .filter(Boolean)
    .join(" ");
  const code = String(error?.code || "");
  const subject = resources[resource] || resources.data;
  const failure = (kind, message, http = 503) =>
    new SupabaseDataError(kind, message, http);
  if (/invalid api key|invalid.*apikey/i.test(text))
    return failure(
      "SUPABASE_KEY_INVALID",
      "Supabase отклонил ключ. Проверьте пару SUPABASE_URL / SUPABASE_ANON_KEY и приоритет .env.local над .env. Перезапустите сайт.",
    );
  if (/ENOTFOUND|EAI_AGAIN|ENODATA|getaddrinfo/i.test(text))
    return failure(
      "SUPABASE_DNS",
      "Сервер сайта не может определить адрес Supabase. Проверьте SUPABASE_URL, DNS и доступ к сети на машине с Node.js.",
    );
  if (/CERT_|SELF_SIGNED|UNABLE_TO_VERIFY|certificate|TLS|SSL/i.test(text))
    return failure(
      "SUPABASE_TLS",
      "Не удалось проверить TLS-соединение с Supabase. Проверьте сертификаты, системное время и HTTPS-фильтрацию антивируса или proxy. Не отключайте проверку TLS.",
    );
  if (
    /TimeoutError|AbortError|timed?\s*out|timeout|aborted|UND_ERR_CONNECT_TIMEOUT/i.test(
      text,
    )
  )
    return failure(
      "SUPABASE_TIMEOUT",
      `Supabase не ответил вовремя: ${subject}. Проверьте доступ с сервера сайта; это не означает отсутствие миграций.`,
    );
  if (
    ["42P01", "42703", "PGRST204", "PGRST205", "42883", "PGRST202"].includes(
      code,
    ) ||
    /relation .* does not exist/i.test(text)
  )
    return failure(
      "SUPABASE_SCHEMA_MISSING",
      `В Supabase отсутствует таблица, поле или функция: ${subject}. Проверьте добавочные миграции проекта; очистку БД не повторяйте.`,
    );
  if (
    code === "42501" ||
    /row-level security|permission denied/i.test(text) ||
    status === 403
  )
    return failure(
      "SUPABASE_FORBIDDEN",
      `Нет доступа к данным Supabase: ${subject}. Проверьте права и политики RLS; не отключайте RLS.`,
      403,
    );
  if (/PGRST30[123]|jwt|invalid claim/i.test(text) || status === 401)
    return failure(
      "SUPABASE_AUTH",
      "Supabase отклонил JWT. Для публичного чтения проверьте актуальность anon / publishable key; для панели повторите вход.",
      401,
    );
  if (
    status >= 500 ||
    /PGRST00[012]|ECONN|EHOSTUNREACH|ENETUNREACH|UND_ERR|fetch failed|network|socket|Failed to fetch/i.test(
      text,
    )
  )
    return failure(
      "SUPABASE_UNAVAILABLE",
      `Не удалось связаться с Supabase: ${subject}. Проверьте доступ с машины, где запущен Node.js, и состояние проекта.`,
    );
  return failure(
    "SUPABASE_QUERY_FAILED",
    `Не удалось ${operation === "read" ? "прочитать" : "сохранить"} ${subject} в Supabase. Выполните необязательную проверку npm run supabase:check на сервере сайта.`,
  );
}

export function isTransientSupabaseError(error, status = 0) {
  return ["SUPABASE_DNS", "SUPABASE_TIMEOUT", "SUPABASE_UNAVAILABLE"].includes(
    supabaseDataError(error, "data", status).code,
  );
}
