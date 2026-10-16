'use client'

import { useEffect, useRef, useState } from 'react'
import type { CatalogProduct } from '../../lib/catalog'
import styles from './cards.module.css'
import { useCart } from './cart'

export function AddButton({ product }: { product: CatalogProduct }) {
  const cart = useCart()
  const [done, setDone] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <button
      type="button"
      className={styles.buy}
      onClick={() => {
        cart.add({
          id: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit || 'шт',
          image: product.image_url,
        })
        setDone(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setDone(false), 800)
      }}
    >
      {done ? 'В корзине' : 'В корзину'}
    </button>
  )
}
