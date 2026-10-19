import { invalidateCatalog } from "../../../../../lib/public-data";
function changed<T>(response: T): T {
  invalidateCatalog();
  return response;
}
import {
  attachSession,
  hasSiteHeader,
  openAdmin,
} from "../../../../../lib/auth";
import { fail, json, readJson, validId } from "../../../../../lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

function missing() {
  return json({ error: "Не найдено" }, 404);
}

export async function PUT(req: Request, ctx: Ctx) {
  if (!hasSiteHeader(req)) return json({ error: "Запрос отклонён" }, 403);
  const opened = await openAdmin(req);
  if ("response" in opened) return opened.response;
  const { id } = await ctx.params;
  if (!validId(id)) return missing();
  try {
    return attachSession(
      changed(
        json(await opened.session.store.saveCategory(await readJson(req), id)),
      ),
      opened.session,
      req,
    );
  } catch (err) {
    return attachSession(fail(err), opened.session, req);
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  if (!hasSiteHeader(req)) return json({ error: "Запрос отклонён" }, 403);
  const opened = await openAdmin(req);
  if ("response" in opened) return opened.response;
  const { id } = await ctx.params;
  if (!validId(id)) return missing();
  try {
    return attachSession(
      changed(json(await opened.session.store.deleteCategory(id))),
      opened.session,
      req,
    );
  } catch (err) {
    return attachSession(fail(err), opened.session, req);
  }
}
