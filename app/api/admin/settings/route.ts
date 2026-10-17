import { attachSession, hasSiteHeader, openAdmin } from "../../../../lib/auth";
import { fail, json, readJson } from "../../../../lib/http";
import { readSettings, saveSettings } from "../../../../lib/settings";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const opened = await openAdmin(req);
  if ("response" in opened) return opened.response;
  try {
    return attachSession(
      json(await readSettings(opened.session.client)),
      opened.session,
      req,
    );
  } catch (err) {
    return fail(err);
  }
}
export async function PUT(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: "Запрос отклонён" }, 403);
  const opened = await openAdmin(req);
  if ("response" in opened) return opened.response;
  try {
    return attachSession(
      json(await saveSettings(await readJson(req), opened.session.client)),
      opened.session,
      req,
    );
  } catch (err) {
    return fail(err);
  }
}
