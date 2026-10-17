import path from "node:path";
import type { AdminContext } from "./auth";
import { createOrderBook } from "../server/orders.mjs";
export async function listAdminOrders(session: AdminContext) {
  if (!session.client)
    return createOrderBook(path.join(process.cwd(), "data", "orders.json"))
      .list()
      .then((rows) =>
        rows.map(
          ({
            email_token_hash: _capability,
            ...row
          }: Record<string, unknown>) => row,
        ),
      );
  const result = await session.client
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (result.error)
    throw new Error("Заявки недоступны. Проверьте миграции и права.");
  return (result.data || []).map(
    ({ email_token_hash: _capability, ...row }) => row,
  );
}
