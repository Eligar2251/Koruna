'use client'

import { useState, useTransition } from 'react'
import { submitOrder } from '@/actions/submit'
import { useCart } from '@/components/cart/cart-context'
import { ChannelChoice, ConsentCheckbox, Field, HoneypotField } from './fields'
import { site } from '@/config/site'

type Delivery = 'pickup' | 'delivery'

export function OrderForm() {
  const { items, clear, close } = useCart()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [channel, setChannel] = useState('phone')
  const [delivery, setDelivery] = useState<Delivery>('pickup')
  const [zone, setZone] = useState<'city' | 'oblast'>('city')
  const [address, setAddress] = useState('')
  const [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')

  if (done) {
    return (
      <div className="notice notice-ok" role="status">
        <p className="notice-title">Заявка отправлена</p>
        <p>Менеджер свяжется с вами удобным способом и подтвердит наличие и стоимость.</p>
        <button type="button" className="btn btn-ghost" onClick={close}>
          Продолжить покупки
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return <p className="muted">Корзина пуста. Добавьте товары из каталога.</p>
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    start(async () => {
      const result = await submitOrder({
        name,
        phone,
        email,
        preferredContact: channel,
        deliveryMethod: delivery,
        deliveryZone: delivery === 'delivery' ? zone : undefined,
        address,
        comment,
        consent: consent as true,
        website,
        sourcePage: window.location.pathname,
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
      })
      if (result.ok) {
        clear()
        setDone(true)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="form" noValidate>
      <Field label="Имя" htmlFor="o-name">
        <input id="o-name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
      </Field>

      <Field label="Как с вами связаться">
        <ChannelChoice value={channel} onChange={setChannel} />
      </Field>

      <div className="grid-2">
        <Field label="Телефон" htmlFor="o-phone" hint={channel === 'email' ? 'Необязательно, если указана почта' : undefined}>
          <input id="o-phone" className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 900 000-00-00" autoComplete="tel" />
        </Field>
        <Field label="Почта" htmlFor="o-email" hint={channel === 'email' ? 'Нужна для ответа' : undefined}>
          <input id="o-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </Field>
      </div>

      <Field label="Получение">
        <div className="chips" role="radiogroup" aria-label="Способ получения">
          <label className={`chip ${delivery === 'pickup' ? 'chip-on' : ''}`}>
            <input type="radio" name="delivery" className="sr-only" checked={delivery === 'pickup'} onChange={() => setDelivery('pickup')} />
            Самовывоз
          </label>
          <label className={`chip ${delivery === 'delivery' ? 'chip-on' : ''}`}>
            <input type="radio" name="delivery" className="sr-only" checked={delivery === 'delivery'} onChange={() => setDelivery('delivery')} />
            Доставка
          </label>
        </div>
      </Field>

      {delivery === 'delivery' ? (
        <>
          <Field label="Где доставить" htmlFor="o-zone" hint={`Доставляем только в ${site.deliveryArea}`}>
            <select id="o-zone" className="input" value={zone} onChange={(e) => setZone(e.target.value as 'city' | 'oblast')}>
              <option value="city">г. Новосибирск</option>
              <option value="oblast">Новосибирская область</option>
            </select>
          </Field>
          <Field label="Адрес доставки" htmlFor="o-address">
            <input id="o-address" className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Улица, дом, название населённого пункта" />
          </Field>
        </>
      ) : null}

      <Field label="Комментарий" htmlFor="o-comment">
        <textarea id="o-comment" className="input" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
      </Field>

      <HoneypotField value={website} onChange={setWebsite} />

      <ConsentCheckbox id="o-consent" checked={consent} onChange={setConsent} />

      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
        {pending ? 'Отправляем…' : 'Отправить заявку'}
      </button>
      <p className="muted small">Цена и наличие подтверждаются менеджером. Оплата — после согласования заказа.</p>
    </form>
  )
}
