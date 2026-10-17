'use client'

import { FormEvent, useEffect, useState } from 'react'
import { formatPrice } from '../../../lib/format'
import type { CatalogProduct } from '../../../lib/catalog'
import { readCart, writeCart, type CartItem } from '../../cart/cart'
import './design/korzina.css'

export function CartView() {
  const [items, setItems] = useState<CartItem[]>([])
  const [catalog, setCatalog] = useState<CatalogProduct[] | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')
  const [pending, setPending] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const sync = () => { setItems(readCart()); setReady(true) }
    sync()
    window.addEventListener('csb-cart', sync)
    window.addEventListener('storage', sync)
    const controller = new AbortController()
    fetch('/api/catalog', { signal: controller.signal, cache: 'no-store' }).then(async response => {
      if (!response.ok) throw new Error('Каталог недоступен')
      const data = await response.json()
      setCatalog(data.products || [])
    }).catch(err => { if (err.name !== 'AbortError') setLoadError('Не удалось проверить цены. Обновите страницу перед оформлением.') })
    return () => { window.removeEventListener('csb-cart', sync); window.removeEventListener('storage', sync); controller.abort() }
  }, [])

  const rows = items.map(item => {
    const fresh = catalog?.find(product => product.id === item.id)
    return { ...item, name: fresh?.name ?? item.name, price: fresh ? fresh.price : item.price, unit: fresh?.unit ?? item.unit,
      image: fresh?.image_url ?? item.image, available: catalog ? Boolean(fresh && fresh.in_stock !== false && fresh.stock_quantity !== 0) : true,
      stock: fresh?.stock_quantity }
  })
  const total = rows.reduce((sum, row) => sum + (row.price ?? 0) * row.qty, 0)
  const unpriced = rows.some(row => row.price == null)
  const blocked = rows.some(row => !row.available || (row.stock != null && row.qty > row.stock))

  function update(next: CartItem[]) {
    try { writeCart(next); setItems(next); setError('') }
    catch { setError('Не удалось сохранить корзину. Разрешите хранение данных в браузере.') }
  }
  function quantity(id: string, qty: number) {
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) return
    update(items.map(row => row.id === id ? { ...row, qty } : row))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!rows.length || blocked || !catalog || pending) return
    setPending(true); setError('')
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'content-type': 'application/json', 'x-csb-request': '1' },
        body: JSON.stringify({ name: form.get('name'), phone: form.get('phone'), email: form.get('email'), address: form.get('address'), comment: form.get('comment'), items: rows.map(row => ({ product_id: row.id, qty: row.qty })) }) })
      const data = await response.json()
      if (!response.ok || !data.id) throw new Error(data.error || 'Не удалось оформить заказ')
      setOrderId(String(data.id)); setItems([])
      try { writeCart([]) } catch { /* Заказ уже сохранён; не отправлять его повторно из-за localStorage. */ }
    } catch (err) { setError(err instanceof Error ? err.message : 'Не удалось оформить заказ') }
    finally { setPending(false) }
  }

  return <main className="csb-cart">
    <a className="csb-cart__back" href="/katalog">← Вернуться к покупкам</a>
    <header className="csb-cart__heading"><div><p className="csb-cart__eyebrow">Центральная Строительная База</p><h1>{orderId ? 'Спасибо за заказ!' : 'Корзина'}</h1></div>{!orderId && <span>{rows.length} позиций</span>}</header>
    {orderId ? <section className="csb-cart__empty"><span className="csb-cart__success">✓</span><h2>Заказ принят</h2><p>Мы свяжемся с вами для подтверждения наличия и доставки.</p><p>Номер: <strong>{orderId}</strong></p><a className="csb-cart__submit" href="/katalog">В каталог</a></section>
      : !ready ? <p role="status">Загружаем корзину…</p>
      : !rows.length ? <section className="csb-cart__empty"><h2>Здесь пока пусто</h2><p>Добавьте строительные материалы из каталога — они появятся здесь.</p><a className="csb-cart__submit" href="/katalog">Перейти в каталог</a></section>
      : <div className="csb-cart__layout"><section className="csb-cart__list" aria-label="Товары в корзине">
        {rows.map(row => <article className="csb-cart__row" key={row.id}>
          <div className="csb-cart__image">{row.image && <img src={row.image} alt="" />}</div>
          <div className="csb-cart__info"><h2 title={row.name}>{row.name}</h2><p>{formatPrice(row.price)} / {row.unit || 'шт'}</p>{!row.available ? <small className="csb-cart__error">Товар больше недоступен — удалите его</small> : row.stock != null && row.qty > row.stock ? <small className="csb-cart__error">Доступно: {row.stock} {row.unit || 'шт'}</small> : <small>Цена и наличие проверяются при оформлении</small>}</div>
          <div className="csb-cart__controls"><div className="csb-cart__qty"><button type="button" aria-label={`Уменьшить: ${row.name}`} disabled={row.qty <= 1 || pending} onClick={() => quantity(row.id, row.qty - 1)}>−</button><input type="number" aria-label={`Количество: ${row.name}`} min={1} max={999} value={row.qty} disabled={pending} onChange={e => quantity(row.id, Number(e.target.value))} /><button type="button" aria-label={`Увеличить: ${row.name}`} disabled={row.qty >= 999 || pending} onClick={() => quantity(row.id, row.qty + 1)}>+</button></div><strong>{row.price == null ? 'По запросу' : formatPrice(row.price * row.qty)}</strong><button type="button" className="csb-cart__remove" disabled={pending} onClick={() => update(items.filter(item => item.id !== row.id))}>Удалить</button></div>
        </article>)}
      </section><aside className="csb-cart__checkout"><h2>Оформление заказа</h2><div className="csb-cart__summary"><span>Товары · {rows.reduce((sum, row) => sum + row.qty, 0)} ед.</span><strong>{formatPrice(total)}</strong></div>{unpriced && <p>Часть цен — по запросу. Итог уточнит менеджер.</p>}<p className="csb-cart__note">Доставка рассчитывается отдельно. Заказ не является онлайн-оплатой.</p>
        <form className="csb-cart__form" onSubmit={submit}>
          <label>Ваше имя<input name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Как к вам обращаться" /></label>
          <label>Телефон<input name="phone" type="tel" required minLength={6} maxLength={40} autoComplete="tel" placeholder="+7 (___) ___-__-__" /></label>
          <label>Электронная почта<input name="email" type="email" maxLength={200} autoComplete="email" placeholder="Необязательно" /></label>
          <label>Адрес доставки<input name="address" maxLength={300} autoComplete="street-address" placeholder="Или укажите самовывоз" /></label>
          <label>Комментарий<textarea name="comment" rows={3} maxLength={1000} placeholder="Пожелания к заказу" /></label>
          {(error || loadError) && <p className="csb-cart__error" role="alert">{error || loadError}</p>}{blocked && <p className="csb-cart__error">Проверьте доступность товаров и количество.</p>}
          <button className="csb-cart__submit" type="submit" disabled={pending || blocked || !catalog}>{pending ? 'Отправляем заказ…' : 'Отправить заказ'}</button>
        </form></aside></div>}
  </main>
}
