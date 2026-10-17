import { invalidateCatalog } from "../../../../lib/public-data";
function changed<T>(response: T): T {
  invalidateCatalog();
  return response;
}
import { attachSession, hasSiteHeader, openAdmin } from "../../../../lib/auth";
import { fail, json, readJson } from "../../../../lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: "Запрос отклонён" }, 403);
  const opened = await openAdmin(req);
  if ("response" in opened) return opened.response;
  try {
    return attachSession(
      changed(
        json(await opened.session.store.saveCategory(await readJson(req))),
      ),
      opened.session,
      req,
    );
  } catch (err) {
    return attachSession(fail(err), opened.session, req);
  }
}
