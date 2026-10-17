import { NextResponse } from "next/server";
import { attachSession, openAdmin } from "../../../../../lib/auth";
import { listAdminOrders } from "../../../../../lib/admin-orders";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(req: Request) {
  const opened = await openAdmin(req);
  if ("response" in opened) return opened.response;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  const encoder = new TextEncoder();
  const started = Date.now();
  let previous = "";
  const stream = new ReadableStream({
    start(controller) {
      const close = () => {
        if (stopped) return;
        stopped = true;
        clearTimeout(timer);
        req.signal.removeEventListener("abort", close);
        try {
          controller.close();
        } catch {}
      };
      req.signal.addEventListener("abort", close, { once: true });
      const poll = async () => {
        if (stopped) return;
        if (Date.now() - started > 45000) {
          close();
          return;
        }
        try {
          const auth = await openAdmin(req);
          if ("response" in auth) {
            close();
            return;
          }
          const data = JSON.stringify({
            orders: await listAdminOrders(auth.session),
          });
          if (stopped) return;
          if (data !== previous) {
            controller.enqueue(
              encoder.encode(`event: snapshot\ndata: ${data}\n\n`),
            );
            previous = data;
          } else controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          if (!stopped)
            controller.enqueue(
              encoder.encode("event: unavailable\ndata: {}\n\n"),
            );
          close();
          return;
        }
        if (!stopped) timer = setTimeout(poll, 3000);
      };
      void poll();
    },
    cancel() {
      stopped = true;
      clearTimeout(timer);
    },
  });
  return attachSession(
    new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store, no-transform",
        "X-Accel-Buffering": "no",
      },
    }),
    opened.session,
    req,
  );
}
