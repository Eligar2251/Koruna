import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { createFileStore } from '../server/store.mjs'
import { buildOrder } from '../server/orders.mjs'
import { seedFileStore } from '../server/seed.mjs'

process.env.JWT_SECRET = 'test-secret-value-123456'

test('пароль хранится односторонним JWT-ключом, сессия — отдельный JWT', async () => {
  const { createAccountBook, passwordMatches, signAccess, readAccess } = await import('../server/accounts.mjs')
  const dir = await mkdtemp(path.join(tmpdir(), 'koruna-admin-'))
  const book = createAccountBook(path.join(dir, 'admins.json'))
  const created = await book.create({ email: 'admin@csb.local', name: 'Админ', password: 'CsbAdmin-2026' })
  const raw = JSON.parse(await readFile(path.join(dir, 'admins.json'), 'utf8'))
  const key = raw.admins[0].password_key
  assert.equal(key.split('.').length, 3)
  assert.equal(key.includes('CsbAdmin-2026'), false)
  assert.equal(await passwordMatches('CsbAdmin-2026', key), true)
  assert.equal(await passwordMatches('wrong-password', key), false)
  assert.equal((await book.list())[0].password_key, undefined)
  const token = signAccess(created)
  assert.equal(readAccess(token)?.sub, created.id)
  assert.equal(readAccess(key), null)
  assert.equal(await book.authenticate('admin@csb.local', 'CsbAdmin-2026') !== null, true)
  await assert.rejects(() => book.create({ email: 'admin@csb.local', name: 'Второй', password: 'CsbAdmin-2026' }))
  await rm(dir, { recursive: true })
})

test('заказ берёт цену из каталога, а не из запроса', async () => {
  const order = buildOrder({
    name: 'Иван',
    phone: '+7 961 222-03-05',
    items: [{ product_id: 'p1', qty: 2, price: 1 }],
  }, {
    products: [{ id: 'p1', name: 'ОСП-3', unit: 'лист', price: 890 }],
  })
  assert.equal(order.items[0].price, 890)
  assert.equal(order.total, 1780)
  assert.throws(() => buildOrder({ name: 'Иван', phone: '+7 961 222-03-05', items: [{ product_id: 'нет', qty: 1 }] }, { products: [] }))
})

test('пустой файл каталога наполняется базовыми товарами', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'koruna-seed-'))
  const store = createFileStore(path.join(dir, 'catalog.json'))
  await seedFileStore(store)
  const catalog = await store.catalog()
  assert.ok(catalog.categories.length >= 8)
  assert.ok(catalog.products.length >= 16)
  assert.equal(String(catalog.products[0].image_url).startsWith('/assets/catalog/'), true)
  await assert.rejects(() => store.saveProduct({ name: 'Чужое фото', image_url: 'https://evil.example/a.jpg' }))
  await rm(dir, { recursive: true })
})
