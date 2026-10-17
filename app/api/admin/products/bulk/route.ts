import {
  attachSession,
  configuredSupabase,
  hasSiteHeader,
  openAdmin,
} from "../../../../../lib/auth";
import { fail, json, readJson } from "../../../../../lib/http";
import { safeImage } from "../../../../../server/settings.mjs";
export async function PATCH(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: "Запрос отклонён" }, 403);
  const opened = await openAdmin(req);
  if ("response" in opened) return opened.response;
  try {
    const body = await readJson(req);
    if (Array.isArray(body.updates))
      for (const update of body.updates) {
        if (
          update.patch?.image_url &&
          !safeImage(update.patch.image_url, configuredSupabase()?.url || "")
        )
          throw new Error("Некорректный адрес фото");
      }
    return attachSession(
      json(await opened.session.store.bulkProducts(body.updates)),
      opened.session,
      req,
    );
  } catch (err) {
    return fail(err);
  }
}
