export type CartItem = {
  id: string
  slug: string
  name: string
  price: number | null
  unit: string | null
  image: string | null
  qty: number
}

const KEY = 'csb-cart'

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]')
    if (!Array.isArray(raw)) return []
    return raw
      .filter((item) => item && typeof item.id === 'string' && Number(item.qty) > 0)
      .map((item) => ({
        id: String(item.id),
        slug: String(item.slug || ''),
        name: String(item.name || ''),
        price: item.price === null || item.price === undefined ? null : Number(item.price),
        unit: item.unit ? String(item.unit) : null,
        image: item.image ? String(item.image) : null,
        qty: Math.min(999, Math.max(1, Math.floor(Number(item.qty)))),
      }))
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('csb-cart'))
}

export function addItem(product: {
  id: string
  slug: string
  name: string
  price?: number | null
  unit?: string | null
  image_url?: string | null
}) {
  const items = readCart()
  const found = items.find((item) => item.id === product.id)
  if (found) found.qty = Math.min(999, found.qty + 1)
  else {
    items.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price ?? null,
      unit: product.unit ?? null,
      image: product.image_url ?? null,
      qty: 1,
    })
  }
  writeCart(items)
}

export function countCart(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0)
}
