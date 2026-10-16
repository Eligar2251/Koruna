import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

const PHONE = /[0-9]/g

function text(value, max) {
  const next = String(value ?? '').trim()
  if (!next) return ''
  if (next.length > max) throw new Error(`Текст длиннее ${max} символов`)
  return next
}

export function buildOrder(body, catalog) {
  const name = text(body.name, 120)
  const phone = text(body.phone, 40)
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
  const items = []
  for (const raw of body.items) {
    const product = products.get(String(raw?.product_id || ''))
    if (!product) throw new Error('Товар не найден')
    const qty = Number(raw.qty)
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) throw new Error('Некорректное количество')
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
  let queue = Promise.resolve()

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
    const run = queue.then(async () => {
      const data = await read()
      const result = await mutator(data)
      await mkdir(path.dirname(file), { recursive: true })
      const tmp = `${file}.tmp`
      await writeFile(tmp, JSON.stringify(data, null, 2))
      await rename(tmp, file)
      return result
    })
    queue = run.then(() => undefined, () => undefined)
    return run
  }

  return {
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
