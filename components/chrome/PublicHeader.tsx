"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSite } from "../site/SiteProvider";
export function PublicHeader({ children }: { children: ReactNode }) {
  const { adminArea } = useSite();
  const path = usePathname(),
    router = useRouter();
  useEffect(() => {
    const refresh = () => router.refresh();
    window.addEventListener("csb:data-changed", refresh);
    return () => window.removeEventListener("csb:data-changed", refresh);
  }, [router]);
  return adminArea || path.startsWith("/admin") ? null : children;
}
