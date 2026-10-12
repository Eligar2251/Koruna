'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart/cart-context'

type Props = {
  product: { id: string; slug: string; name: string; price: number | null; unit: string }
}

export function AddToCart({ product }: Props) {
  const { add } = useCart()
  const [qty, setQty] = useState(1)

  return (
    <div className="add-row">
      <div className="qty">
        <button type="button" aria-label="Уменьшить" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
          −
        </button>
        <input
          aria-label="Количество"
          inputMode="numeric"
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(9999, Number(e.target.value.replace(/\D/g, '')) || 1)))}
        />
        <button type="button" aria-label="Увеличить" onClick={() => setQty((q) => Math.min(9999, q + 1))}>
          +
        </button>
      </div>
      <button type="button" className="btn btn-primary" onClick={() => add(product, qty)}>
        Добавить в корзину
      </button>
    </div>
  )
}
