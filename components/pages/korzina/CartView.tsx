'use client'

import { FormEvent, useEffect, useState } from 'react'
import { formatPrice } from '../../../lib/format'
import { readCart, writeCart, type CartItem } from '../../cart/cart'
import './design/korzina.css'

export function CartView() {
  const [items, setItems] = useState<CartItem[] | null>(null)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const sync = () => setItems(readCart())
    sync()
    window.addEventListener('csb-cart', sync)
    return () => window.removeEventListener('csb-cart', sync)
  }, [])

  function update(next: CartItem[]) {
    writeCart(next)
    setItems(next)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!items?.length) return
    setPending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csb-request': '1' },
        body: JSON.stringify({
          name: form.get('name'),
          phone: form.get('phone'),
          email: form.get('email'),
          address: form.get('address'),
          comment: form.get('comment'),
          items: items.map((item) => ({ product_id: item.id, qty: item.qty })),
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Не удалось оформить заказ')
      writeCart([])
      setItems([])
      setOrderId(String(data.id || ''))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось оформить заказ')
    } finally {
      setPending(false)
    }
  }

  if (!items) return <main className="csb-cart" />
  if (orderId) {
    return (
      <main className="csb-cart">
        <h1>Заказ принят</h1>
        <p className="csb-cart__empty">Номер заказа: {orderId}</p>
        <p>
          <a className="csb-cart__back" href="/katalog">
            Вернуться в каталог
          </a>
        </p>
      </main>
    )
  }
  if (!items.length) {
    return (
      <main className="csb-cart">
        <h1>Корзина</h1>
        <p className="csb-cart__empty">
          Корзина пуста. <a href="/katalog">Открыть каталог</a>
        </p>
      </main>
    )
  }

  const priced = items.filter((item) => item.price !== null)
  const total = priced.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0)

  return (
    <main className="csb-cart">
      <h1>Корзина</h1>
      <div className="csb-cart__list">
        {items.map((item) => (
          <div className="csb-cart__row" key={item.id}>
            {item.image ? <img src={item.image} alt="" /> : <span />}
            <div>
              <h2>{item.name}</h2>
              <p>
                {item.price === null ? 'по запросу' : formatPrice(item.price)}
                {item.unit ? ` / ${item.unit}` : ''}
              </p>
            </div>
            <div className="csb-cart__qty">
              <button
                type="button"
                aria-label="Меньше"
                onClick={() =>
                  update(items.flatMap((row) => (row.id === item.id ? (row.qty > 1 ? [{ ...row, qty: row.qty - 1 }] : []) : [row])))
                }
              >
                −
              </button>
              <span>{item.qty}</span>
              <button
                type="button"
                aria-label="Больше"
                onClick={() => update(items.map((row) => (row.id === item.id ? { ...row, qty: Math.min(999, row.qty + 1) } : row)))}
              >
                +
              </button>
              <button type="button" className="csb-cart__remove" onClick={() => update(items.filter((row) => row.id !== item.id))}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="csb-cart__total">{priced.length ? `Итого ${formatPrice(total)}` : 'Сумма по запросу'}</p>
      <form className="csb-cart__form" onSubmit={submit}>
        <label>
          Имя
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          Телефон
          <input name="phone" required autoComplete="tel" />
        </label>
        <label>
          Почта
          <input name="email" type="email" autoComplete="email" />
        </label>
        <label>
          Адрес
          <input name="address" autoComplete="street-address" />
        </label>
        <label>
          Комментарий
          <textarea name="comment" rows={3} />
        </label>
        {error ? <p className="csb-cart__error">{error}</p> : null}
        <button className="csb-cart__submit" type="submit" disabled={pending}>
          {pending ? 'Отправка…' : 'Оформить заказ'}
        </button>
      </form>
    </main>
  )
}
