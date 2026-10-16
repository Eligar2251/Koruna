'use client'

import { useState } from 'react'
import { addItem } from '../cart/cart'

type Product = {
  id: string
  slug: string
  name: string
  price?: number | null
  unit?: string | null
  image_url?: string | null
}

export function AddButton({ product }: { product: Product }) {
  const [done, setDone] = useState(false)

  return (
    <button
      type="button"
      className="koruna-card__add"
      onClick={() => {
        addItem(product)
        setDone(true)
        window.setTimeout(() => setDone(false), 1200)
      }}
    >
      {done ? 'В корзине' : 'В корзину'}
    </button>
  )
}

export function Description({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open ? <p className="koruna-card__text">{text}</p> : null}
      <button type="button" className="koruna-card__more" onClick={() => setOpen((value) => !value)}>
        {open ? 'Скрыть' : 'Описание'}
      </button>
    </>
  )
}
