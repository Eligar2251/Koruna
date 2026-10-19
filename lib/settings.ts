import path from "node:path";
import { readSettingsConfig } from "../server/supabase-read.mjs";
import { mergeSiteSettings } from "../server/intake-config.mjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { defaultSettings, type SiteSettings } from "./site-config";
import { supabaseClient, configuredSupabase } from "./auth";
import { fileSettings, validateSettings } from "../server/settings.mjs";
const local = () =>
  fileSettings(
    path.join(process.cwd(), "data", "site-settings.json"),
    defaultSettings,
  );
export async function readSettings(
  client: SupabaseClient | null = supabaseClient(),
): Promise<SiteSettings> {
  if (!client) return local().read();
  const data = await readSettingsConfig(client);
  return mergeSiteSettings(data, defaultSettings);
}
export async function saveSettings(
  body: Record<string, unknown>,
  client: SupabaseClient | null,
) {
  const current = await readSettings(client);
  const expected = String(body.revision || "");
  if (current.revision !== expected)
    throw new Error(
      "Настройки уже изменены. Обновите страницу перед сохранением.",
    );
  const next = validateSettings(
    body,
    defaultSettings,
    configuredSupabase()?.url || "",
  ) as SiteSettings;
  if (!client) return local().save(next, expected);
  const result = await client.rpc("save_site_settings", {
    p_config: next,
    p_expected: expected,
  });
  if (result.error)
    throw new Error(
      "Настройки не сохранены: проверьте права и обновите страницу.",
    );
  return next;
}
