import { readSettings } from "../../../lib/settings";
import { fail, json } from "../../../lib/http";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return json(await readSettings());
  } catch (err) {
    return fail(err);
  }
}
