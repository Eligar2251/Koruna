import { hasSiteHeader } from "../../../lib/auth";
import { fail, json, readJson } from "../../../lib/http";
import { readSettings } from "../../../lib/settings";
import { saveRequest } from "../../../lib/requests";
import {
  buildInquiry,
  consentRecord,
  requestAllowed,
} from "../../../server/requests.mjs";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: "Запрос отклонён" }, 403);
  if (!requestAllowed(req))
    return json({ error: "Слишком много запросов. Подождите." }, 429);
  try {
    const body = await readJson(req);
    const settings = await readSettings();
    return json(
      await saveRequest({
        ...buildInquiry(body),
        consent: consentRecord(body, settings),
      }),
    );
  } catch (err) {
    return fail(err);
  }
}
