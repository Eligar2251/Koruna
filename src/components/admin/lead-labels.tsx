import type { LeadStatus, LeadType } from '@/lib/types'

export const leadTypeLabels: Record<LeadType, string> = {
  order: 'Заказ',
  callback: 'Звонок',
  contact: 'Сообщение',
}

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена',
  cancelled: 'Отменена',
}

export const contactLabels: Record<string, string> = {
  phone: 'Телефон',
  email: 'Почта',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  max: 'Max',
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`status status-${status}`}>{leadStatusLabels[status]}</span>
}
