import path from "node:path";
import { randomUUID } from "node:crypto";
import { supabaseClient } from "./auth";
import { createOrderBook } from "../server/orders.mjs";
export async function saveRequest(order: Record<string, unknown>) {
  const remote = supabaseClient();
  if (remote) {
    const id = randomUUID();
    const result = await remote.from("orders").insert({ ...order, id });
    if (result.error)
      throw new Error(
        "Не удалось сохранить заявку. Проверьте миграцию сайта или свяжитесь по телефону.",
      );
    return { id };
  }
  const saved = await createOrderBook(
    path.join(process.cwd(), "data", "orders.json"),
  ).add(order);
  return { id: saved.id };
}
