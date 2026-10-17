'use client'

import { FormEvent, useState } from 'react'
import { adminApi } from './api'
import { formatPrice } from '../../lib/format'

export type Order = { id: string; customer_name: string; phone: string; email?: string; address?: string; comment?: string; total: number | null; created_at: string; status: string; request_kind?: string; email_status?: string; email_attempted_at?: string; consent?: { at?: string; version?: string }; items: Array<{ product_id: string; name: string; qty: number; unit: string; price: number | null }> }
export type StockProduct = { id: string; name: string; sku: string | null; unit: string | null; stock_quantity?: number | null; in_stock: boolean }
export type Movement = { id: string; product_name: string; delta: number; balance: number; kind: string; note: string; created_at: string }
export const statuses: Record<string, string> = { new: 'Новый', processing: 'В работе', completed: 'Завершён', cancelled: 'Отменён' }
const kinds: Record<string, string> = { receipt: 'Приход', write_off: 'Списание', adjustment: 'Корректировка' }
const date = (value: string) => new Date(value).toLocaleString('ru-RU')

export function Orders({ orders, reload }: { orders: Order[]; reload: () => Promise<void> }) {
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  return <section className="panel"><div className="panel-heading"><h2>Заказы клиентов</h2><span className="badge">{orders.length}</span></div>
    <div className="toolbar"><input aria-label="Поиск заказов" placeholder="Имя, телефон или номер заказа" value={search} onChange={e => setSearch(e.target.value)} /><select aria-label="Фильтр статуса" value={filter} onChange={e => setFilter(e.target.value)}><option value="">Все статусы</option>{Object.entries(statuses).map(([value, title]) => <option key={value} value={value}>{title}</option>)}</select></div>
    {error && <p role="alert" className="error">{error}</p>}
    <div className="orders-list">{orders.filter(o => (!filter || o.status === filter) && `${o.customer_name} ${o.phone} ${o.id}`.toLowerCase().includes(search.toLowerCase())).map(order => <article className="order" key={order.id}>
      <div className="order-heading"><div><strong>{order.request_kind === 'inquiry' ? 'Заявка' : 'Заказ'} № {order.id.slice(0, 8)}</strong><small>{date(order.created_at)}</small></div><span className={`badge badge--${order.status}`}>{statuses[order.status] || order.status}</span><strong>{formatPrice(order.total)}</strong></div>
      <div className="order-contact"><strong>{order.customer_name}</strong><a href={`tel:${order.phone}`}>{order.phone}</a>{order.email && <a href={`mailto:${order.email}`}>{order.email}</a>}</div>
      {order.address && <p>Доставка: {order.address}</p>}{order.comment && <p>Комментарий: {order.comment}</p>}
      {order.consent && <small>Согласие: {order.consent.version} · {order.consent.at ? date(order.consent.at) : ''}</small>}
      <details><summary>Состав заказа · {order.items?.length || 0} поз.</summary><div className="table-wrap"><table><thead><tr><th>Товар</th><th>Количество</th><th>Цена</th><th>Сумма</th></tr></thead><tbody>{(order.items || []).map((item, index) => <tr key={index}><td>{item.name}</td><td className="nowrap">{item.qty} {item.unit}</td><td className="nowrap">{formatPrice(item.price)}</td><td className="nowrap">{formatPrice(item.price == null ? null : item.price * item.qty)}</td></tr>)}</tbody></table></div></details>
      <div className="order-email"><span>Почта: {({sent:'принято почтовым сервером',failed:'ошибка отправки',unconfigured:'SMTP не настроен',pending:'ожидает отправки'} as Record<string,string>)[order.email_status || 'pending']}</span>
      {order.email_status !== 'sent' && <button type="button" disabled={busy===order.id} onClick={async()=>{
        setBusy(order.id);setError('')
        try {const result=await adminApi('/api/admin/orders/notify',{method:'POST',body:JSON.stringify({id:order.id})});await reload();if(result.status!=='sent')setError('Заявка сохранена. Письмо не отправлено: проверьте SMTP в настройках почты.')} catch(err){setError(err instanceof Error?err.message:'Ошибка отправки')} finally{setBusy('')}
      }}>Повторить отправку на почту</button>}</div>
      <label className="order-status">Статус<select aria-label={`Статус заказа ${order.id.slice(0, 8)}`} value={order.status} disabled={busy === order.id} onChange={async e => { const status = e.target.value; setBusy(order.id); setError(''); try { await adminApi('/api/admin/orders', { method: 'PATCH', body: JSON.stringify({ id: order.id, status }) }); await reload() } catch (err) { setError(err instanceof Error ? err.message : 'Ошибка сохранения') } finally { setBusy('') } }}>{Object.entries(statuses).map(([value, title]) => <option key={value} value={value}>{title}</option>)}</select></label>
    </article>)}{!orders.length && <p className="empty">Заказов пока нет. Новые заявки из корзины появятся здесь.</p>}</div>
  </section>
}

export function Warehouse({ products, movements, reload }: { products: StockProduct[]; movements: Movement[]; reload: () => Promise<void> }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState('')
  const [kind, setKind] = useState('receipt')
  const [qty, setQty] = useState('1')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('')
    try { await adminApi('/api/admin/inventory', { method: 'POST', body: JSON.stringify({ product_id: selected, kind, delta: kind === 'write_off' ? -Number(qty) : Number(qty), note }) }); setNote(''); setQty('1'); await reload(); setMessage('Операция записана, остаток обновлён.') }
    catch (err) { setError(err instanceof Error ? err.message : 'Ошибка операции') }
    finally { setBusy(false) }
  }
  return <div className="warehouse"><section className="panel"><div className="panel-heading"><h2>Остатки на складе</h2><span className="badge">{products.length} товаров</span></div><p className="lead">«Не учтён» — начальный остаток ещё не внесён. Заказы не резервируют и не списывают товар автоматически: оформляйте списание при отгрузке, указывая номер заказа.</p><input aria-label="Поиск по складу" placeholder="Найти по названию или артикулу" value={search} onChange={e => setSearch(e.target.value)} />
      <div className="table-wrap"><table><thead><tr><th>Материал</th><th>Артикул</th><th>Остаток</th><th>Операция</th></tr></thead><tbody>{products.filter(p => `${p.name} ${p.sku || ''}`.toLowerCase().includes(search.toLowerCase())).map(product => <tr key={product.id}><td>{product.name}</td><td>{product.sku || '—'}</td><td className="nowrap"><span className={`badge ${product.stock_quantity === 0 ? 'badge--cancelled' : ''}`}>{product.stock_quantity == null ? 'Не учтён' : `${product.stock_quantity} ${product.unit || 'шт'}`}</span></td><td><button className="ghost" type="button" onClick={() => { setSelected(product.id); document.getElementById('stock-operation')?.scrollIntoView({ block: 'center', behavior: 'smooth' }) }}>Изменить остаток</button></td></tr>)}</tbody></table></div></section>
      <section className="panel" id="stock-operation"><h2>Складская операция</h2><form onSubmit={submit}><div className="split"><label>Товар<select value={selected} required onChange={e => setSelected(e.target.value)}><option value="">Выберите товар</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>Тип операции<select value={kind} onChange={e => { setKind(e.target.value); setQty('1') }}>{Object.entries(kinds).map(([value, title]) => <option key={value} value={value}>{title}</option>)}</select></label><label>{kind === 'adjustment' ? 'Изменение (+ / −)' : 'Количество'}<input type="number" step={1} min={kind === 'adjustment' ? -1000000000 : 1} max={1000000000} value={qty} onChange={e => setQty(e.target.value)} required /></label></div><label>Основание / номер документа<input value={note} onChange={e => setNote(e.target.value)} required minLength={2} maxLength={500} placeholder="Например: поставка № 24, отгрузка заказа № …" /></label><button type="submit" disabled={busy}>{busy ? 'Сохраняем…' : 'Провести операцию'}</button>{error && <p className="error" role="alert">{error}</p>}{message && <p className="success" role="status">{message}</p>}</form></section>
      <section className="panel"><h2>Журнал движений</h2><p className="lead">Последние 200 операций. Записи журнала нельзя изменить или удалить из панели.</p><div className="table-wrap"><table><thead><tr><th>Дата</th><th>Товар</th><th>Операция</th><th>Изменение</th><th>После</th><th>Основание</th></tr></thead><tbody>{movements.map(m => <tr key={m.id}><td className="nowrap">{date(m.created_at)}</td><td>{m.product_name}</td><td>{kinds[m.kind]}</td><td className="nowrap">{m.delta > 0 ? '+' : ''}{m.delta}</td><td>{m.balance}</td><td>{m.note}</td></tr>)}</tbody></table>{!movements.length && <p className="empty">Складских операций пока нет.</p>}</div></section>
  </div>
}
