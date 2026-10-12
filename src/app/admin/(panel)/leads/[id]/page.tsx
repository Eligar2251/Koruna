import Link from 'next/link'
import { notFound } from 'next/navigation'
import { updateLead } from '@/actions/admin-leads'
import { contactLabels, LeadStatusBadge, leadStatusLabels, leadTypeLabels } from '@/components/admin/lead-labels'
import { getLead } from '@/lib/data'
import { formatDateTime, formatPrice } from '@/lib/format'
import type { LeadStatus } from '@/lib/types'

export const metadata = { title: 'Заявка — админка' }

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await getLead(id)
  if (!lead) notFound()

  const statuses = Object.keys(leadStatusLabels) as LeadStatus[]

  return (
    <>
      <div className="admin-top">
        <div>
          <p className="small muted" style={{ marginBottom: 4 }}>
            <Link href="/admin/leads">Заявки</Link> / {leadTypeLabels[lead.type]}
          </p>
          <h1>
            {lead.name} <LeadStatusBadge status={lead.status} />
          </h1>
        </div>
        <span className="small muted">Создана {formatDateTime(lead.created_at)}</span>
      </div>

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {lead.type === 'order' ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Товар</th>
                    <th>Кол-во</th>
                    <th>Цена</th>
                    <th>Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {lead.items.map((item) => (
                    <tr key={item.product_id}>
                      <td>{item.name}</td>
                      <td>
                        {item.qty} {item.unit}
                      </td>
                      <td>{item.price === null ? 'По запросу' : formatPrice(item.price)}</td>
                      <td>{item.price === null ? '—' : formatPrice(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={3}>Итого</th>
                    <th>{lead.total === null ? 'Уточнить' : formatPrice(lead.total)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : null}

          <div className="card">
            <dl className="kv">
              <dt>Способ связи</dt>
              <dd>{contactLabels[lead.preferred_contact] ?? lead.preferred_contact}</dd>
              {lead.phone ? (
                <>
                  <dt>Телефон</dt>
                  <dd>
                    <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                  </dd>
                </>
              ) : null}
              {lead.email ? (
                <>
                  <dt>Почта</dt>
                  <dd>
                    <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  </dd>
                </>
              ) : null}
              {lead.type === 'order' ? (
                <>
                  <dt>Получение</dt>
                  <dd>{lead.delivery_method === 'delivery' ? 'Доставка' : 'Самовывоз'}</dd>
                </>
              ) : null}
              {lead.address ? (
                <>
                  <dt>Адрес</dt>
                  <dd>{lead.address}</dd>
                </>
              ) : null}
              {lead.comment ? (
                <>
                  <dt>Комментарий</dt>
                  <dd className="lines">{lead.comment}</dd>
                </>
              ) : null}
              <dt>Согласие</dt>
              <dd className="small">
                версия {lead.consent_version}, {formatDateTime(lead.consent_at)}
              </dd>
              {lead.source_page ? (
                <>
                  <dt>Страница</dt>
                  <dd className="small">{lead.source_page}</dd>
                </>
              ) : null}
            </dl>
          </div>
        </div>

        <form action={updateLead} className="card form">
          <input type="hidden" name="id" value={lead.id} />
          <div className="field">
            <label className="field-label" htmlFor="status">Статус</label>
            <select id="status" name="status" className="input" defaultValue={lead.status}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {leadStatusLabels[s]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="adminNote">Заметка для себя</label>
            <textarea id="adminNote" name="adminNote" className="input" rows={6} defaultValue={lead.admin_note ?? ''} />
            <span className="field-hint">Видна только в админке</span>
          </div>
          <button type="submit" className="btn btn-primary">
            Сохранить
          </button>
        </form>
      </div>
    </>
  )
}
