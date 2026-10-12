'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem } from '@/lib/types'

const STORAGE_KEY = 'csb-cart-v1'

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number | null
  isOpen: boolean
  open: () => void
  close: () => void
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.id && i.qty > 0) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setItems(readStorage())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, ready])

  const add = useCallback((item: Omit<CartItem, 'qty'>, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, ...item, qty: Math.min(i.qty + qty, 9999) } : i))
      }
      return [...prev, { ...item, qty: Math.min(qty, 9999) }]
    })
    setIsOpen(true)
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    const next = Math.max(1, Math.min(9999, Math.floor(qty) || 1))
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: next } : i)))
  }, [])

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0)
    const total = items.some((i) => i.price === null)
      ? null
      : Math.round(items.reduce((sum, i) => sum + (i.price ?? 0) * i.qty, 0) * 100) / 100
    return {
      items,
      count,
      total,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQty,
      remove,
      clear,
    }
  }, [items, isOpen, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart вне CartProvider')
  return ctx
}
