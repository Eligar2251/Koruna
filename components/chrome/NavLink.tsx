"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes } from "react";
const warmed = new Map<string, number>();
export function NavLink({
  href = "/",
  onPointerEnter,
  onFocus,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const router = useRouter();
  function warm() {
    if (!href.startsWith("/") || href.startsWith("//")) return;
    if (Date.now() - (warmed.get(href) || 0) < 15000) return;
    warmed.set(href, Date.now());
    if (warmed.size > 150) warmed.delete(warmed.keys().next().value!);
    router.prefetch(href);
  }
  return (
    <Link
      {...props}
      href={href}
      prefetch={false}
      onPointerEnter={(event) => {
        warm();
        onPointerEnter?.(event);
      }}
      onFocus={(event) => {
        warm();
        onFocus?.(event);
      }}
    />
  );
}
