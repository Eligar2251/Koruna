import Link from 'next/link'
import { getLeads } from '@/lib/data'
import { formatDateTime, formatPrice } from '@/lib/format'
import type { LeadStatus } from '@/lib/types'
import { LeadStatusBadge, leadTypeLabels } from '@/components/admin/lead-labels'

export const metadata = { title: 'Заявки — админка' }

const filters: { value: LeadStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'new', label: 'Новые' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'done', label: 'Выполнены' },
  { value: 'cancelled', label: 'Отменены' },
]

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const current = (filters.find((f) => f.value === status)?.value ?? 'all') as LeadStatus | 'all'
  const leads = await getLeads(current)

  return (
    <>
      <div className="admin-top">
        <h1>Заявки</h1>
      </div>

      <div className="toolbar filters">
        {filters.map((f) => (
          <Link key={f.value} href={f.value === 'all' ? '/admin/leads' : `/admin/leads?status=${f.value}`} aria-current={current === f.value}>
            {f.label}
          </Link>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="empty">Заявок нет</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Тип</th>
                <th>Имя</th>
                <th>Контакт</th>
                <th>Сумма</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td className="small">{formatDateTime(l.created_at)}</td>
                  <td>{leadTypeLabels[l.type]}</td>
                  <td>
                    <Link href={`/admin/leads/${l.id}`} style={{ fontWeight: 600 }}>
                      {l.name}
                    </Link>
                  </td>
                  <td className="small">
                    {l.phone ?? ''}
                    {l.phone && l.email ? <br /> : null}
                    {l.email ?? ''}
                  </td>
                  <td>{l.type === 'order' ? (l.total === null ? 'По запросу' : formatPrice(l.total)) : '—'}</td>
                  <td>
                    <LeadStatusBadge status={l.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="small muted" style={{ marginTop: 12 }}>Показаны последние 300 заявок.</p>
    </>
  )
}
