import { hasSiteHeader } from "../../../lib/auth";
import { fail, json, readJson } from "../../../lib/http";
import { getStore } from "../../../lib/server";
import { readSettings } from "../../../lib/settings";
import { saveRequest } from "../../../lib/requests";
import { buildOrder } from "../../../server/orders.mjs";
import { consentRecord, requestAllowed } from "../../../server/requests.mjs";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: "Запрос отклонён" }, 403);
  if (!requestAllowed(req))
    return json({ error: "Слишком много запросов. Подождите." }, 429);
  try {
    const body = await readJson(req,16384),
      settings = await readSettings();
    const consent = consentRecord(body, settings);
    const store = await getStore();
    return json(
      await saveRequest({
        ...buildOrder(body, await store.catalog()),
        request_kind: "order",
        consent,
      }, settings),
    );
  } catch (err) {
    return fail(err);
  }
}
