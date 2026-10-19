import path from "node:path";
import { randomUUID, randomBytes } from "node:crypto";
import { supabaseClient, type AdminContext } from "./auth";
import { createOrderBook } from "../server/orders.mjs";
import { sendRequestEmail } from "../server/mail.mjs";
import type { SiteSettings } from "./site-config";
import type { SupabaseClient } from "@supabase/supabase-js";
const book = () =>
  createOrderBook(path.join(process.cwd(), "data", "orders.json"));
async function deliver(
  order: Record<string, unknown>,
  hash: string,
  settings: SiteSettings,
  client: SupabaseClient | null,
) {
  const status = await sendRequestEmail(order, settings.fields);
  try {
    if (client) {
      const result = await client.rpc("finish_request_email", {
        p_id: order.id,
        p_token_hash: hash,
        p_status: status,
      });
      if (result.error) throw new Error("Email status update failed");
    } else await book().finishEmail(order.id, hash, status);
  } catch {
    console.error("Не удалось обновить статус письма для заявки", order.id);
  }
  return status;
}
export async function saveRequest(
  order: Record<string, unknown>,
  settings: SiteSettings,
) {
  const remote = supabaseClient(),
    id = randomUUID(),
    hash = randomBytes(32).toString("hex");
  const row = {
    ...order,
    id,
    created_at: new Date().toISOString(),
    email_status: "pending",
    email_attempted_at: new Date().toISOString(),
    email_token_hash: hash,
  };
  if (remote) {
    const result = await remote.from("orders").insert(row);
    if (result.error)
      throw new Error(
        "Не удалось сохранить заявку. Проверьте миграции сайта или свяжитесь по телефону.",
      );
  } else await book().add(row);
  // Email outages never roll back an accepted request or cause a visitor to resubmit it.
  await deliver(row, hash, settings, remote);
  return { id };
}
export async function retryRequestEmail(
  id: string,
  session: AdminContext,
  settings: SiteSettings,
) {
  const hash = randomBytes(32).toString("hex");
  let row;
  if (session.client) {
    const result = await session.client
      .from("orders")
      .update({
        email_token_hash: hash,
        email_status: "pending",
        email_attempted_at: new Date().toISOString(),
      })
      .eq("id", id)
      .or(
        `email_status.in.(failed,unconfigured),and(email_status.eq.pending,email_attempted_at.lt.${new Date(Date.now() - 120000).toISOString()}),and(email_status.eq.pending,email_attempted_at.is.null)`,
      )
      .select("*")
      .maybeSingle();
    if (result.error || !result.data)
      throw new Error(
        "Письмо уже отправлено, отправляется или заявка не найдена",
      );
    row = result.data;
  } else row = await book().claimEmail(id, hash);
  return { status: await deliver(row, hash, settings, session.client) };
}
