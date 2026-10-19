"use client";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sidebar = useRef<HTMLElement>(null);
  const filterToggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!filtersOpen) return;
    const media = window.matchMedia("(max-width: 800px)");
    if (!media.matches) {
      setFiltersOpen(false);
      return;
    }
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebar.current
      ?.querySelector<HTMLElement>("button, input, select")
      ?.focus();
    const close = () => {
      if (!media.matches) setFiltersOpen(false);
    };
    media.addEventListener("change", close);
    return () => {
      document.body.style.overflow = overflow;
      media.removeEventListener("change", close);
      filterToggle.current?.focus();
    };
  }, [filtersOpen]);
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
    <div className="koruna-products-layout">
      {filtersOpen && (
        <button
          className="koruna-filter-backdrop"
          type="button"
          aria-label="Закрыть фильтры"
          onClick={() => setFiltersOpen(false)}
        />
      )}
      <aside
        ref={sidebar}
        id="catalog-filters"
        className={`koruna-filter-sidebar${filtersOpen ? " is-open" : ""}`}
        aria-label="Фильтры каталога"
        role={filtersOpen ? "dialog" : undefined}
        aria-modal={filtersOpen || undefined}
        onKeyDown={(event) => {
          if (!filtersOpen) return;
          if (event.key === "Escape") setFiltersOpen(false);
          if (event.key === "Tab") {
            const elements = sidebar.current?.querySelectorAll<HTMLElement>(
              "button, input, select",
            );
            if (!elements?.length) return;
            const first = elements[0],
              last = elements[elements.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="koruna-filter-sidebar__heading">
          <h3>Фильтры</h3>
          <button
            type="button"
            className="koruna-filter-close"
            aria-label="Закрыть панель фильтров"
            onClick={() => setFiltersOpen(false)}
          >
            ×
          </button>
        </div>
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
          <button
            type="button"
            className="koruna-filters__reset"
            onClick={reset}
          >
            Сбросить
          </button>
        </div>
      </aside>
      <div className="koruna-products-results">
        <button
          ref={filterToggle}
          type="button"
          className="koruna-filter-toggle"
          aria-expanded={filtersOpen}
          aria-controls="catalog-filters"
          onClick={() => setFiltersOpen(true)}
        >
          Фильтры
        </button>
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
      </div>
    </div>
  );
}
