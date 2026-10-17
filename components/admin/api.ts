export class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code = "",
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}
export async function adminApi(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("x-csb-request", "1");
  if (options.body) headers.set("content-type", "application/json");
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener("abort", abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timer = setTimeout(abort, 30000);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: "same-origin",
      cache: "no-store",
      headers,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const fallback =
        response.status === 404
          ? "Допуск в панель истёк или адрес изменён. Откройте секретный адрес заново."
          : response.status === 401
            ? "Сессия не подтверждена. Повторите вход."
            : "Ошибка сервера. Проверьте подключение и миграции.";
      throw new AdminApiError(
        typeof data?.error === "string" ? data.error : fallback,
        response.status,
        data?.code || "",
      );
    }
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw new AdminApiError(
        "Сервер вернул некорректный ответ. Проверьте адрес сайта и настройки proxy.",
        response.status,
        "INVALID_RESPONSE",
      );
    if (options.method && options.method !== "GET")
      window.dispatchEvent(new Event("csb:data-changed"));
    return data;
  } catch (error) {
    if (controller.signal.aborted)
      throw new AdminApiError(
        "Запрос прерван или занял слишком много времени. Проверьте соединение сайта с Supabase и повторите попытку.",
        0,
        "REQUEST_TIMEOUT",
      );
    throw error;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  }
}
