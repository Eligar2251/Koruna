import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import { readSettings } from "./settings";
import { getStore } from "./server";
import type { CatalogCategory, CatalogProduct } from "./catalog";

// Only anonymous, public data is shared. Auth, orders and checkout stay uncached.
export const publicSettings = cache(
  unstable_cache(() => readSettings(), ["public-site-settings"], {
    revalidate: 30,
    tags: ["site-settings"],
  }),
);
export const publicCatalog = cache(
  unstable_cache(
    async () => {
      const store = await getStore();
      return (await store.catalog()) as {
        categories: CatalogCategory[];
        products: CatalogProduct[];
      };
    },
    ["public-catalog"],
    { revalidate: 30, tags: ["catalog"] },
  ),
);
export function invalidateCatalog() {
  revalidateTag("catalog");
}
export function invalidateSettings() {
  revalidateTag("site-settings");
}
