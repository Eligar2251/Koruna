// Next.js loads .env before register(). No setup command or generated config is required.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { adminConfigurationErrors } = await import("./server/admin-gate.mjs");
  const errors = adminConfigurationErrors(process.env);
  if (errors.length) {
    console.warn(
      "[ЦСБ] Закрытая панель отключена. Заполните ADMIN_PATH и JWT_SECRET в серверном .env и перезапустите сайт. Публичный сайт продолжит работать.",
    );
    for (const message of errors) console.warn("[ЦСБ] " + message);
  }
}
