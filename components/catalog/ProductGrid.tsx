"use client";
import { useState } from "react";
import { AddButton, Description } from "./AddButton";
import { SiteImage } from "../site/SiteImage";
import { formatPrice } from "../../lib/format";
import type { CatalogProduct } from "../../lib/catalog";
export function ProductGrid({ products }: { products: CatalogProduct[] }) {
  const [query, setQuery] = useState(""),
    [sort, setSort] = useState("default"),
    [stock, setStock] = useState(false);
  const rows = products.filter(
    (p) =>
      `${p.name} ${p.sku || ""} ${p.description || ""}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!stock || p.in_stock !== false),
  );
  if (sort === "name") rows.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  if (sort === "asc")
    rows.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  if (sort === "desc") rows.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  return (
    <>
      <div className="koruna-filters">
        <label>
          Поиск
          <input
            type="search"
            placeholder="Название, артикул или материал"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Сортировка
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">По порядку каталога</option>
            <option value="name">По названию</option>
            <option value="asc">Сначала дешевле</option>
            <option value="desc">Сначала дороже</option>
          </select>
        </label>
        <label className="koruna-filters__check">
          <input
            type="checkbox"
            checked={stock}
            onChange={(e) => setStock(e.target.checked)}
          />
          В наличии
        </label>
      </div>
      <p className="koruna-catalog__state" role="status">
        Найдено: {rows.length}
      </p>
      <div className="koruna-grid">
        {rows.map((product) => (
          <article
            className="koruna-card koruna-card--product"
            key={product.id}
          >
            <div className="koruna-card__media">
              <SiteImage
                src={product.image_url || "/assets/image-unavailable.svg"}
                alt={product.name}
              />
            </div>
            <div className="koruna-card__body">
              <h3 title={product.name}>{product.name}</h3>
              <p className="koruna-card__price">
                {product.price == null
                  ? "Цена по запросу"
                  : `${formatPrice(product.price)} / ${product.unit || "шт"}`}
              </p>
              <p className="koruna-card__meta">
                {product.in_stock === false ? "Под заказ" : "В наличии"}
              </p>
              <Description
                text={product.description || "Описание пока не добавлено."}
                title={product.name}
              />
              <AddButton product={product} />
            </div>
          </article>
        ))}
      </div>
      {!rows.length && <p>Попробуйте другой запрос или сбросьте фильтры.</p>}
    </>
  );
}
