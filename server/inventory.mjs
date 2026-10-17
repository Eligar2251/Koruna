export function stockInput(body) {
  const delta = Number(body.delta)
  const kind = String(body.kind || '')
  const note = String(body.note || '').trim()
  if (!Number.isSafeInteger(delta) || delta === 0 || Math.abs(delta) > 1000000000) throw new Error('Некорректное количество')
  if (!['receipt', 'write_off', 'adjustment'].includes(kind)) throw new Error('Некорректная операция')
  if ((kind === 'receipt' && delta < 0) || (kind === 'write_off' && delta > 0)) throw new Error('Некорректный знак количества')
  if (note.length < 2 || note.length > 500) throw new Error('Укажите основание операции (2–500 символов)')
  return { delta, kind, note }
}

export const ORDER_STATUSES = ['new', 'processing', 'completed', 'cancelled']
export function orderStatus(value) {
  if (!ORDER_STATUSES.includes(value)) throw new Error('Некорректный статус заказа')
  return value
}
