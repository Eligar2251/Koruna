export function buildOrder(body: Record<string, unknown>, catalog: { products?: unknown[] }): {
  customer_name: string
  phone: string
  email: string | null
  address: string | null
  comment: string | null
  items: Array<{ product_id: string; name: string; unit: string; qty: number; price: number | null }>
  total: number | null
  status: string
}

export type OrderBook = {
  list(): Promise<unknown[]>
  add(order: Record<string, unknown>): Promise<{ id: string }>
}

export function createOrderBook(file: string): OrderBook
