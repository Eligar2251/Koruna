"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import "./design/menu.css";
export function MenuButton() {
  const [open, setOpen] = useState(false),
    button = useRef<HTMLButtonElement>(null),
    path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const nav = button.current
      ?.closest("#t-header")
      ?.querySelector(".tmenu-mobile__menucontent_hidden, .t-menu-base");
    nav?.classList.toggle("csb-nav-open", open);
    return () => nav?.classList.remove("csb-nav-open");
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const link = (e: MouseEvent) => {
      if ((e.target as Element)?.closest("#t-header a[href]")) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("click", link);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("click", link);
    };
  }, [open]);
  return (
    <button
      ref={button}
      type="button"
      className="t-menu-burger t-menuburger"
      aria-label="Навигационное меню"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
    >
      <div className="t-menu-burger__icon t-menu-burger__icon_first t-menu-burger__icon_small">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ backgroundColor: "#000000" }} />
        ))}
      </div>
    </button>
  );
}
