'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number | null
  unit: string
  image: string | null
  qty: number
}

type Draft = Omit<CartItem, 'qty'>

type CartApi = {
  ready: boolean
  items: CartItem[]
  count: number
  add: (item: Draft) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartApi | null>(null)
const KEY = 'csb-cart'

function valid(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false
  const item = value as CartItem
  return typeof item.id === 'string' && typeof item.name === 'string' && Number.isInteger(item.qty) && item.qty > 0
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]') as unknown
      if (Array.isArray(raw)) setItems(raw.filter(valid))
    } catch {
      setItems([])
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items, ready])

  const api = useMemo<CartApi>(() => ({
    ready,
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    add(item) {
      setItems((prev) => {
        const found = prev.find((row) => row.id === item.id)
        if (!found) return [...prev, { ...item, qty: 1 }]
        return prev.map((row) => (row.id === item.id ? { ...row, qty: Math.min(999, row.qty + 1) } : row))
      })
    },
    setQty(id, qty) {
      setItems((prev) => prev.flatMap((row) => {
        if (row.id !== id) return [row]
        if (qty < 1) return []
        return [{ ...row, qty: Math.min(999, qty) }]
      }))
    },
    remove(id) {
      setItems((prev) => prev.filter((row) => row.id !== id))
    },
    clear() {
      setItems([])
    },
  }), [items, ready])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('Корзина недоступна')
  return cart
}
