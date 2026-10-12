'use client'

import { useState, useTransition } from 'react'
import { submitRequest } from '@/actions/submit'
import { ChannelChoice, ConsentCheckbox, Field, HoneypotField } from './fields'

type Props = {
  type: 'callback' | 'contact'
  withComment?: boolean
  submitLabel?: string
  id?: string
}

export function RequestForm({ type, withComment = false, submitLabel = 'Отправить', id }: Props) {
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [channel, setChannel] = useState('phone')
  const [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')

  if (done) {
    return (
      <div className="notice notice-ok" role="status">
        <p className="notice-title">Спасибо, заявка принята</p>
        <p>Мы свяжемся с вами в рабочее время.</p>
      </div>
    )
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    start(async () => {
      const result = await submitRequest({
        type,
        name,
        phone,
        email,
        preferredContact: channel,
        comment,
        consent: consent as true,
        website,
        sourcePage: window.location.pathname,
      })
      if (result.ok) setDone(true)
      else setError(result.error)
    })
  }

  return (
    <form id={id} onSubmit={onSubmit} className="form" noValidate>
      <div className="grid-2">
        <Field label="Имя" htmlFor={`${type}-name`}>
          <input id={`${type}-name`} className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </Field>
        <Field label="Телефон" htmlFor={`${type}-phone`}>
          <input id={`${type}-phone`} className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 900 000-00-00" autoComplete="tel" />
        </Field>
      </div>

      <Field label="Почта" htmlFor={`${type}-email`} hint="Укажите, если удобнее ответ на почту">
        <input id={`${type}-email`} className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </Field>

      <Field label="Удобный способ связи">
        <ChannelChoice value={channel} onChange={setChannel} name={`${type}-channel`} />
      </Field>

      {withComment ? (
        <Field label="Комментарий" htmlFor={`${type}-comment`}>
          <textarea id={`${type}-comment`} className="input" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
        </Field>
      ) : null}

      <HoneypotField value={website} onChange={setWebsite} />

      <ConsentCheckbox id={`${type}-consent`} checked={consent} onChange={setConsent} />

      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? 'Отправляем…' : submitLabel}
      </button>
    </form>
  )
}
