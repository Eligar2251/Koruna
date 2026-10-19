import { invalidateCatalog } from "../../../../lib/public-data";
function changed<T>(response: T): T {
  invalidateCatalog();
  return response;
}
import { attachSession, hasSiteHeader, openAdmin } from "../../../../lib/auth";
import { fail, json, readJson } from "../../../../lib/http";
import { applyImageFields, saveImage } from "../../../../lib/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: "Запрос отклонён" }, 403);
  const opened = await openAdmin(req);
  if ("response" in opened) return opened.response;
  try {
    const body = await readJson(req);
    const imageUrl = body.image_base64
      ? await saveImage(body, opened.session.client)
      : undefined;
    applyImageFields(body, imageUrl);
    return attachSession(
      changed(json(await opened.session.store.saveProduct(body))),
      opened.session,
      req,
    );
  } catch (err) {
    return attachSession(fail(err), opened.session, req);
  }
}
