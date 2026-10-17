"use client";
import { useDeferredValue, useMemo, useState } from "react";
import { AddButton, Description } from "./AddButton";
import { SiteImage } from "../site/SiteImage";
import { formatPrice } from "../../lib/format";
import {
  categorySlugs,
  type CatalogCategory,
  type CatalogProduct,
} from "../../lib/catalog";
export function ProductGrid({
  products,
  categories = [],
}: {
  products: CatalogProduct[];
  categories?: CatalogCategory[];
}) {
  const [query, setQuery] = useState(""),
    [sort, setSort] = useState("default"),
    [stock, setStock] = useState(false),
    [category, setCategory] = useState(""),
    [min, setMin] = useState(""),
    [max, setMax] = useState("");
  const search = useDeferredValue(query.trim().toLowerCase());
  const rows = useMemo(() => {
    const ids = new Set(
      categories
        .filter((c) => categorySlugs(category).includes(c.slug))
        .map((c) => c.id),
    );
    const result = products.filter(
      (p) =>
        `${p.name} ${p.sku || ""} ${p.description || ""}`
          .toLowerCase()
          .includes(search) &&
        (!stock || p.in_stock !== false) &&
        (!category || (!!p.category_id && ids.has(p.category_id))) &&
        (!min || (p.price != null && p.price >= Number(min))) &&
        (!max || (p.price != null && p.price <= Number(max))),
    );
    if (sort === "name")
      result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    if (sort === "asc")
      result.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === "desc")
      result.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    return result;
  }, [products, categories, search, stock, category, min, max, sort]);
  const options = categories.filter((c) => {
    const ids = new Set(
      categories
        .filter((child) => categorySlugs(c.slug).includes(child.slug))
        .map((child) => child.id),
    );
    return products.some((p) => p.category_id && ids.has(p.category_id));
  });
  function reset() {
    setQuery("");
    setSort("default");
    setStock(false);
    setCategory("");
    setMin("");
    setMax("");
  }
  return (
    <>
      <div className="koruna-filters">
        <label className="koruna-filters__search">
          Поиск
          <input
            type="search"
            placeholder="Название, артикул или материал"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Категория
          <select
            aria-label="Категория"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Все категории</option>
            {options.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Сортировка
          <select
            aria-label="Сортировка"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">По порядку каталога</option>
            <option value="name">По названию</option>
            <option value="asc">Сначала дешевле</option>
            <option value="desc">Сначала дороже</option>
          </select>
        </label>
        <fieldset className="koruna-filters__price">
          <legend>Цена, ₽</legend>
          <input
            type="number"
            min="0"
            step="any"
            aria-label="Цена от"
            placeholder="От"
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
          <span>—</span>
          <input
            type="number"
            min="0"
            step="any"
            aria-label="Цена до"
            placeholder="До"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
        </fieldset>
        <label className="koruna-filters__check">
          <input
            type="checkbox"
            checked={stock}
            onChange={(e) => setStock(e.target.checked)}
          />
          В наличии
        </label>
        <button type="button" className="koruna-filters__reset" onClick={reset}>
          Сбросить
        </button>
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
                loading="lazy"
                decoding="async"
                width={320}
                height={210}
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
