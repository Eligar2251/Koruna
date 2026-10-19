import {
  attachSession,
  configuredSupabase,
  openAdmin,
} from "../../../../lib/auth";
import { fail, json } from "../../../../lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const opened = await openAdmin(req);
    const mode = configuredSupabase() ? "supabase" : "file";
    if ("response" in opened) {
      if (opened.response.status === 401) return json({ ok: false, mode });
      return opened.response;
    }
    return attachSession(
      json({
        ok: true,
        mode: opened.session.mode,
        role: opened.session.role,
        userId: opened.session.userId,
      }),
      opened.session,
      req,
    );
  } catch (err) {
    return fail(err);
  }
}
