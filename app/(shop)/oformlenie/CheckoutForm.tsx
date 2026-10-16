'use client'

import { FormEvent, useState } from 'react'
import { useCart } from '../../../components/site/cart'
import styles from './checkout.module.css'

export function CheckoutForm() {
  const cart = useCart()
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!cart.items.length) {
      setError('Корзина пуста')
      return
    }
    const form = new FormData(event.currentTarget)
    setPending(true)
    setError('')
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json', 'x-csb-request': '1' },
        body: JSON.stringify({
          name: form.get('name'),
          phone: form.get('phone'),
          email: form.get('email'),
          address: form.get('address'),
          comment: form.get('comment'),
          items: cart.items.map((item) => ({ product_id: item.id, qty: item.qty })),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Не удалось оформить заказ')
      cart.clear()
      setOrderId(String(data.id || ''))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось оформить заказ')
    } finally {
      setPending(false)
    }
  }

  if (!cart.ready) return null
  if (orderId) {
    return <p className={styles.ok}>Заказ принят. Номер {orderId}.</p>
  }
  if (!cart.items.length) {
    return <p><a className={styles.link} href="/katalog">В каталог</a></p>
  }
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label>
        Имя
        <input name="name" required maxLength={120} autoComplete="name" />
      </label>
      <label>
        Телефон
        <input name="phone" required maxLength={40} autoComplete="tel" />
      </label>
      <label>
        Почта
        <input name="email" type="email" maxLength={200} autoComplete="email" />
      </label>
      <label>
        Адрес
        <input name="address" maxLength={300} autoComplete="street-address" />
      </label>
      <label>
        Комментарий
        <textarea name="comment" maxLength={1000} rows={4} />
      </label>
      <button type="submit" disabled={pending}>{pending ? 'Отправка' : 'Отправить заказ'}</button>
      <p className={styles.error}>{error}</p>
    </form>
  )
}
