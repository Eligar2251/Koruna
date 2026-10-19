"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import {
  categoryHref,
  categorySlugs,
  type CatalogCategory,
} from "../../lib/catalog";
import { SiteText } from "../site/SiteProvider";
import "./design/navigation.css";
export function CatalogMenu({ categories }: { categories: CatalogCategory[] }) {
  const [open, setOpen] = useState(false),
    root = useRef<HTMLLIElement>(null),
    path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  const children = new Set([
    "osb-3",
    "gipsokarton",
    "fanera",
    "brusok",
    "plitnyi",
    "rulonnyi",
  ]);
  const roots = categories.filter(
    (c) =>
      !children.has(c.slug) ||
      !categories.some(
        (parent) =>
          parent.slug !== c.slug && categorySlugs(parent.slug).includes(c.slug),
      ),
  );
  return (
    <li
      className="t-menu-base__list-item csb-catalog-menu"
      ref={root}
      onMouseEnter={() => {
        if (matchMedia("(hover:hover)").matches) setOpen(true);
      }}
      onMouseLeave={() => {
        if (matchMedia("(hover:hover)").matches) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          root.current?.querySelector("button")?.focus();
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <div className="t-menu__link-wrapper csb-catalog-menu__trigger">
        <NavLink className="t-menu__link-item" href="/katalog">
          <SiteText id="d0ef3540b088" fallback="Каталог" />
        </NavLink>
        <button
          type="button"
          aria-label="Разделы каталога"
          aria-expanded={open}
          aria-controls="csb-catalog-dropdown"
          onClick={() => setOpen(!open)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div
        className="csb-catalog-dropdown"
        id="csb-catalog-dropdown"
        hidden={!open}
      >
        <NavLink
          href="/katalog"
          className="csb-catalog-dropdown__all"
          onClick={() => setOpen(false)}
        >
          Весь каталог
        </NavLink>
        <ul>
          {roots.map((category) => (
            <li key={category.id}>
              <NavLink
                href={categoryHref(category.slug)}
                onClick={() => setOpen(false)}
              >
                {category.name}
              </NavLink>
              {categories.some(
                (c) =>
                  c.slug !== category.slug &&
                  categorySlugs(category.slug).includes(c.slug),
              ) && (
                <ul>
                  {categories
                    .filter(
                      (c) =>
                        c.slug !== category.slug &&
                        categorySlugs(category.slug).includes(c.slug),
                    )
                    .map((c) => (
                      <li key={c.id}>
                        <NavLink
                          href={categoryHref(c.slug)}
                          onClick={() => setOpen(false)}
                        >
                          {c.name}
                        </NavLink>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
