import { attachSession, hasSiteHeader, openAdmin } from "../../../../lib/auth";
import { fail, json, readJson } from "../../../../lib/http";
import { saveImage } from "../../../../lib/server";
export const runtime = "nodejs";
export async function POST(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: "Запрос отклонён" }, 403);
  const opened = await openAdmin(req);
  if ("response" in opened) return opened.response;
  try {
    return attachSession(
      json({
        url: await saveImage(await readJson(req), opened.session.client),
      }),
      opened.session,
      req,
    );
  } catch (err) {
    return fail(err);
  }
}
