import { productInput } from "./store.mjs";
export function buildBulkRows(updates, products, categories) {
  if (!Array.isArray(updates) || !updates.length || updates.length > 100)
    throw new Error("Укажите от 1 до 100 товаров");
  const ids = new Set();
  const categoryIds = new Set(categories.map((c) => c.id));
  const allowed = new Set([
    "name",
    "slug",
    "sku",
    "category_id",
    "price",
    "unit",
    "description",
    "image_url",
    "is_active",
    "in_stock",
    "sort_order",
  ]);
  const rows = updates.map((update) => {
    if (!update || typeof update !== "object")
      throw new Error("Некорректный пакет");
    const id = String(update.id || "");
    if (ids.has(id)) throw new Error("Некорректно: повторяющийся товар");
    ids.add(id);
    const current = products.find((p) => p.id === id);
    if (!current) throw new Error("Товар не найден");
    if (
      !update.patch ||
      typeof update.patch !== "object" ||
      Array.isArray(update.patch)
    )
      throw new Error("Некорректные изменения");
    for (const key of Object.keys(update.patch))
      if (!allowed.has(key))
        throw new Error("Некорректное поле пакета: " + key);
    const merged = { ...current, ...update.patch };
    const input = productInput(merged, current.slug);
    if (input.category_id && !categoryIds.has(input.category_id))
      throw new Error("Категория не найдена");
    if (current.stock_quantity != null)
      input.in_stock = current.stock_quantity > 0;
    return { id, ...input };
  });
  const final = products.map((p) => rows.find((r) => r.id === p.id) || p);
  if (new Set(final.map((p) => p.slug)).size !== final.length)
    throw new Error("Такой адрес товара уже есть");
  return rows;
}
