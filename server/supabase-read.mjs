import {
  isTransientSupabaseError,
  SupabaseDataError,
  supabaseDataError,
} from "./supabase-errors.mjs";

// Only read factories belong here. Every attempt receives a fresh query and deadline.
export async function readSupabase(factory, timeoutMs = 8000) {
  for (let attempt = 0; attempt < 2; attempt++) {
    let result;
    try {
      const query = factory(AbortSignal.timeout(timeoutMs));
      // Newer PostgREST SDKs retry too; do not multiply retries/backoffs under our deadline.
      if (typeof query?.retry === "function") query.retry(false);
      result = await query;
    } catch (error) {
      result = { data: null, error, status: 0 };
    }
    if (
      !result.error ||
      attempt === 1 ||
      !isTransientSupabaseError(result.error, result.status)
    )
      return result;
  }
}
export async function readSettingsConfig(client) {
  const result = await readSupabase((signal) =>
    client
      .from("site_settings")
      .select("config")
      .eq("id", "main")
      .abortSignal(signal)
      .maybeSingle(),
  );
  if (result.error)
    throw supabaseDataError(result.error, "settings", result.status);
  if (!result.data)
    throw new SupabaseDataError(
      "SUPABASE_SETTINGS_MISSING",
      "Строка main в site_settings не найдена или недоступна. Проверьте строку и политику чтения без очистки БД.",
    );
  return result.data.config || {};
}
