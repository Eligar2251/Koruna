'use client'

import { useRef, useState } from 'react'
import { addItem } from '../cart/cart'

type Product = { id: string; slug: string; name: string; price?: number | null; unit?: string | null; image_url?: string | null; in_stock?: boolean; stock_quantity?: number | null }

export function AddButton({ product }: { product: Product }) {
  const [done, setDone] = useState(false)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const unavailable = product.in_stock === false || product.stock_quantity === 0
  const max = Math.min(999, product.stock_quantity ?? 999)
  return <>
    <div className="koruna-card__actions">
      <div className="koruna-qty" aria-label="Количество">
        <button type="button" aria-label={`Уменьшить количество: ${product.name}`} disabled={qty <= 1 || unavailable} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
        <input aria-label={`Количество: ${product.name}`} type="number" min={1} max={max} value={qty} disabled={unavailable} onChange={e => setQty(Math.max(1, Math.min(max, Number(e.target.value) || 1)))} />
        <button type="button" aria-label={`Увеличить количество: ${product.name}`} disabled={qty >= max || unavailable} onClick={() => setQty(Math.min(max, qty + 1))}>+</button>
      </div>
      <button type="button" className="koruna-card__add" disabled={unavailable} onClick={() => {
        try { addItem(product, qty); setDone(true); setError(''); window.setTimeout(() => setDone(false), 1500) }
        catch { setError('Разрешите хранение корзины в браузере.') }
      }}>{unavailable ? 'Нет в наличии' : done ? 'Добавлено ✓' : 'В корзину'}</button>
    </div>
    <span className="koruna-card__feedback" role="status">{error || (done ? `Добавлено: ${qty} ${product.unit || 'шт'}` : '')}</span>
  </>
}

export function Description({ text, title }: { text: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  return <>
    <button type="button" className="koruna-card__more" onClick={() => dialog.current?.showModal()}>Подробнее</button>
    <dialog ref={dialog} className="koruna-description" aria-label={title} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close() }}>
      <h2>{title}</h2><p>{text}</p>
      <button type="button" onClick={() => dialog.current?.close()}>Закрыть</button>
    </dialog>
  </>
}
