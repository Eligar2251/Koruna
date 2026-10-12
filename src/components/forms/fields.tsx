import Link from 'next/link'
import type { ReactNode } from 'react'
import { contactChannels } from '@/config/site'

export function Field({
  label,
  children,
  htmlFor,
  hint,
}: {
  label: string
  children: ReactNode
  htmlFor?: string
  hint?: string
}) {
  return (
    <div className="field">
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  )
}

export function ChannelChoice({
  value,
  onChange,
  name = 'preferredContact',
}: {
  value: string
  onChange: (v: string) => void
  name?: string
}) {
  return (
    <div className="chips" role="radiogroup" aria-label="Удобный способ связи">
      {contactChannels.map((c) => (
        <label key={c.value} className={`chip ${value === c.value ? 'chip-on' : ''}`}>
          <input
            type="radio"
            name={name}
            value={c.value}
            checked={value === c.value}
            onChange={() => onChange(c.value)}
            className="sr-only"
          />
          {c.label}
        </label>
      ))}
    </div>
  )
}

export function ConsentCheckbox({
  checked,
  onChange,
  id,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  id: string
}) {
  return (
    <label htmlFor={id} className="consent">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        Я даю согласие на обработку персональных данных в соответствии с{' '}
        <Link href="/consent">согласием</Link> и{' '}
        <Link href="/privacy">политикой обработки персональных данных</Link>
      </span>
    </label>
  )
}

// Скрытое поле-ловушка для ботов: человек его не видит и не заполняет
export function HoneypotField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="hp" aria-hidden="true">
      <label>
        Сайт
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  )
}
