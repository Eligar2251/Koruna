import type { MetadataRoute } from 'next'
import { site } from '@/config/site'
import { getActiveCategories, getActiveProducts } from '@/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ['', '/catalog', '/delivery', '/about', '/contacts', '/privacy', '/consent', '/cookies']
  const [categories, products] = await Promise.all([
    getActiveCategories().catch(() => []),
    getActiveProducts().catch(() => []),
  ])
  return [
    ...staticPages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'weekly' as const })),
    ...categories.map((c) => ({ url: `${site.url}/catalog/${c.slug}`, changeFrequency: 'weekly' as const })),
    ...products.map((p) => ({ url: `${site.url}/product/${p.slug}`, changeFrequency: 'weekly' as const })),
  ]
}
