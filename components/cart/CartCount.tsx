'use client'

import { useEffect, useState } from 'react'
import { countCart, readCart } from './cart'
import './design/count.css'

export function CartCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const sync = () => setCount(countCart(readCart()))
    sync()
    window.addEventListener('csb-cart', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('csb-cart', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  if (!count) return null
  return <span className="t-menuwidgeticons__icon-counter csb-cart-count">{count}</span>
}
