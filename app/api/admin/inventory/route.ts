import { invalidateCatalog } from "../../../../lib/public-data";
function changed<T>(response: T): T {
  invalidateCatalog();
  return response;
}
import { attachSession, hasSiteHeader, openAdmin } from "../../../../lib/auth";
import { fail, json, readJson, validId } from "../../../../lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const opened = await openAdmin(req);
  if ("response" in opened) return opened.response;
  try {
    return attachSession(
      json({ movements: await opened.session.store.stockMovements() }),
      opened.session,
      req,
    );
  } catch (err) {
    return attachSession(fail(err), opened.session, req);
  }
}

export async function POST(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: "Запрос отклонён" }, 403);
  const opened = await openAdmin(req);
  if ("response" in opened) return opened.response;
  try {
    const body = await readJson(req);
    const id = String(body.product_id || "");
    if (!validId(id)) return json({ error: "Товар не найден" }, 404);
    return attachSession(
      changed(json(await opened.session.store.adjustStock(id, body))),
      opened.session,
      req,
    );
  } catch (err) {
    return attachSession(fail(err), opened.session, req);
  }
}
