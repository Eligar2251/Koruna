"use client";
import { useState, type ImgHTMLAttributes, type HTMLAttributes } from "react";
import { useSite } from "./SiteProvider";
import manifest from "./media.json";
const FALLBACK = "/assets/image-unavailable.svg";
function useSource(src: string, slot = "") {
  const { settings } = useSite();
  return (
    settings.images[slot] ||
    settings.images[src] ||
    (manifest as Record<string, { src: string }>)[src]?.src ||
    src ||
    FALLBACK
  );
}
export function SiteImage({
  src = "",
  alt = "",
  slot = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { slot?: string }) {
  const source = useSource(typeof src === "string" ? src : "", slot);
  const [failed, setFailed] = useState("");
  return (
    <img
      {...props}
      alt={alt}
      src={failed === source ? FALLBACK : source}
      onError={() => setFailed(source)}
    />
  );
}
export function SiteBackground({
  original,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & { original: string }) {
  const source = useSource(original);
  return (
    <div {...props} style={{ ...style, backgroundImage: `url("${source}")` }} />
  );
}

export function SiteBackgroundLink({
  original,
  href = "/katalog",
  style,
  ...props
}: import("react").AnchorHTMLAttributes<HTMLAnchorElement> & {
  original: string;
}) {
  const source = useSource(original, `category:${href.split("/").at(-1)}`);
  return (
    <a
      {...props}
      href={href}
      role={undefined}
      aria-label={props["aria-label"] || "Перейти в раздел каталога"}
      style={{
        ...style,
        backgroundImage: `url("${source}"), url("${FALLBACK}")`,
      }}
    />
  );
}
