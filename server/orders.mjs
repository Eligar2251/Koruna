import { normalizePhone } from './phone.mjs'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { orderStatus } from './inventory.mjs'

const queues = new Map()

const PHONE = /[0-9]/g

function text(value, max) {
  const next = String(value ?? '').trim()
  if (!next) return ''
  if (next.length > max) throw new Error(`Текст длиннее ${max} символов`)
  return next
}

export function buildOrder(body, catalog) {
  const name = text(body.name, 120)
  const phone = normalizePhone(body.phone)
  const email = text(body.email, 200)
  const address = text(body.address, 300)
  const comment = text(body.comment, 1000)
  if (name.length < 2) throw new Error('Укажите имя')
  if ((phone.match(PHONE) || []).length < 6) throw new Error('Укажите телефон')
  if (email && !email.includes('@')) throw new Error('Укажите почту')
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 40) {
    throw new Error('Укажите товары')
  }
  const products = new Map((catalog.products || []).map((item) => [item.id, item]))
  const merged = new Map()
  for (const raw of body.items) {
    const id = String(raw?.product_id || '')
    const qty = Number(raw?.qty)
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) throw new Error('Некорректное количество')
    merged.set(id, (merged.get(id) || 0) + qty)
  }
  const items = []
  for (const [product_id, amount] of merged) {
    const raw = { product_id, qty: amount }
    const product = products.get(String(raw?.product_id || ''))
    if (!product) throw new Error('Товар не найден')
    if (product.in_stock === false) throw new Error('Товар недоступен для заказа: ' + product.name)
    const qty = Number(raw.qty)
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) throw new Error('Некорректное количество')
    if (product.stock_quantity != null && qty > product.stock_quantity) throw new Error('Недостаточно товара: ' + product.name)
    items.push({
      product_id: product.id,
      name: product.name,
      unit: product.unit || 'шт',
      qty,
      price: product.price === null || product.price === undefined ? null : Number(product.price),
    })
  }
  const priced = items.filter((item) => item.price !== null)
  const total = priced.length
    ? Math.round(priced.reduce((sum, item) => sum + item.price * item.qty, 0) * 100) / 100
    : null
  return {
    customer_name: name,
    phone,
    email: email || null,
    address: address || null,
    comment: comment || null,
    items,
    total,
    status: 'new',
  }
}

export function createOrderBook(file) {


  async function read() {
    try {
      const data = JSON.parse(await readFile(file, 'utf8'))
      data.orders ??= []
      return data
    } catch (err) {
      if (err.code === 'ENOENT') return { orders: [] }
      throw err
    }
  }

  function update(mutator) {
    const run = (queues.get(file) || Promise.resolve()).then(async () => {
      const data = await read()
      const result = await mutator(data)
      await mkdir(path.dirname(file), { recursive: true })
      const tmp = `${file}.tmp`
      await writeFile(tmp, JSON.stringify(data, null, 2))
      await rename(tmp, file)
      return result
    })
    queues.set(file, run.then(() => undefined, () => undefined))
    return run
  }

  return {
    claimEmail(id, hash) {
      return update(data => {
        const row=data.orders.find(order=>order.id===id)
        if (!row) throw new Error('Заказ не найден')
        if (row.email_status==='sent' || (row.email_status==='pending' && Date.parse(row.email_attempted_at)>Date.now()-120000)) throw new Error('Письмо уже отправлено или отправляется')
        row.email_token_hash=hash; row.email_status='pending'; row.email_attempted_at=new Date().toISOString()
        return row
      })
    },
    finishEmail(id,hash,status) {
      if (!['sent','failed','unconfigured'].includes(status)) throw new Error('Некорректное состояние')
      return update(data=>{
        const row=data.orders.find(order=>order.id===id && order.email_token_hash===hash && order.email_status==='pending')
        if (!row) throw new Error('Нет доступа')
        row.email_status=status;row.email_attempted_at=new Date().toISOString();delete row.email_token_hash
        return status
      })
    },
    setStatus(id, status) {
      orderStatus(status)
      return update((data) => {
        const row = data.orders.find((order) => order.id === id)
        if (!row) throw new Error('Заказ не найден')
        row.status = status
        return row
      })
    },
    async list() {
      const data = await read()
      return data.orders.slice().reverse()
    },
    add(order) {
      return update((data) => {
        const row = { id: randomUUID(), created_at: new Date().toISOString(), ...order }
        data.orders.push(row)
        return row
      })
    },
  }
}
