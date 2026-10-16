export type CatalogCategory = {
  id: string
  slug: string
  name: string
  description?: string | null
  sort_order?: number
}

export type CatalogProduct = {
  id: string
  slug: string
  name: string
  category_id: string | null
  price: number | null
  unit: string | null
  image_url: string | null
  in_stock?: boolean
  description?: string | null
}

const groups: Record<string, string[]> = {
  'listovye-materialy': ['listovye-materialy', 'osb-3', 'gipsokarton', 'fanera', 'brusok'],
  uteplitel: ['uteplitel', 'plitnyi', 'rulonnyi'],
}

export function categorySlugs(slug: string) {
  return groups[slug] || [slug]
}

export function productsIn(products: CatalogProduct[], categories: CatalogCategory[], slug: string) {
  const ids = new Set(
    categories.filter((item) => categorySlugs(slug).includes(item.slug)).map((item) => item.id),
  )
  return products.filter((item) => item.category_id && ids.has(item.category_id))
}

const images: Record<string, string> = {
  'listovye-materialy': '/assets/catalog/sheets.jpg',
  'osb-3': '/assets/catalog/sheets.jpg',
  gipsokarton: '/assets/catalog/gypsum.jpg',
  fanera: '/assets/catalog/sheets.jpg',
  brusok: '/assets/catalog/sheets.jpg',
  uteplitel: '/assets/catalog/rolls.jpg',
  plitnyi: '/assets/catalog/boards.jpg',
  rulonnyi: '/assets/catalog/rolls.jpg',
  polikarbonat: '/assets/catalog/poly.jpg',
  'gidro-paroizolyaziya': '/assets/catalog/membrane.jpg',
  'profil-karkas': '/assets/catalog/profiles.jpg',
  'montajnaya-himiya': '/assets/catalog/foam.jpg',
  'krepej-i-metizy': '/assets/catalog/fasteners.jpg',
  'krovelnye-materialy': '/assets/catalog/steel.jpg',
}

export function categoryImage(slug: string) {
  return images[slug] || ''
}
