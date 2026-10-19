import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'
import { PGlite } from '@electric-sql/pglite'
import { createFileStore } from '../server/store.mjs'
import { createOrderBook, buildOrder } from '../server/orders.mjs'
import { readSupabaseConfig } from '../server/supabase-config.mjs'

test('Supabase: только URL + anon, ошибочная конфигурация не включает локальный вход', () => {
  assert.equal(readSupabaseConfig({}), null)
  assert.equal(readSupabaseConfig({ SUPABASE_URL: 'https://YOUR_PROJECT_REF.supabase.co', SUPABASE_ANON_KEY: 'your-anon-key' }), null)
  assert.throws(() => readSupabaseConfig({ SUPABASE_URL: 'https://project.supabase.co' }))
  assert.throws(() => readSupabaseConfig({ SUPABASE_URL: 'https://project.supabase.co', SUPABASE_ANON_KEY: 'sb_secret_nope' }))
  const service = 'header.' + Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url') + '.signature'
  assert.throws(() => readSupabaseConfig({ SUPABASE_URL: 'https://project.supabase.co', SUPABASE_ANON_KEY: service }))
  assert.deepEqual(readSupabaseConfig({ SUPABASE_URL: 'https://project.supabase.co/', SUPABASE_ANON_KEY: 'sb_publishable_example' }), { url: 'https://project.supabase.co', key: 'sb_publishable_example' })
})

test('приход/списание атомарны между экземплярами локального store; журнал сохраняется', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'csb-stock-'))
  try {
    const file = path.join(dir, 'catalog.json')
    const store = createFileStore(file)
    const product = await store.saveProduct({ name: 'Утеплитель', price: 100 })
    await store.adjustStock(product.id, { kind: 'receipt', delta: 10, note: 'Начальные остатки' })
    await Promise.all(Array.from({ length: 5 }, () => createFileStore(file).adjustStock(product.id, { kind: 'write_off', delta: -2, note: 'Отгрузка' })))
    const current = (await store.adminList()).products[0]
    assert.equal(current.stock_quantity, 0)
    assert.equal(current.in_stock, false)
    await assert.rejects(() => store.adjustStock(product.id, { kind: 'write_off', delta: -1, note: 'Отгрузка' }), /остаток/)
    assert.equal((await store.stockMovements()).length, 6)
    await store.saveProduct({ name: 'Новое название', in_stock: true }, product.id)
    assert.equal((await store.adminList()).products[0].in_stock, false)
    assert.throws(() => store.adjustStock(product.id, { kind: 'receipt', delta: -1, note: 'Ошибка' }))
    assert.throws(() => store.adjustStock(product.id, { kind: 'adjustment', delta: 1.5, note: 'Ошибка' }))
    const orders = createOrderBook(path.join(dir, 'orders.json'))
    const order = await orders.add({ customer_name: 'Иван', status: 'new' })
    assert.equal((await orders.setStatus(order.id, 'processing')).status, 'processing')
    assert.throws(() => orders.setStatus(order.id, 'invalid'))
  } finally { await rm(dir, { recursive: true, force: true }) }
})

test('заказ объединяет одинаковые товары и проверяет суммарное количество', () => {
  const body = { name: 'Иван', phone: '79991234567', items: [{ product_id: 'p', qty: 2 }, { product_id: 'p', qty: 3 }] }
  const catalog = { products: [{ id: 'p', name: 'Фанера', price: 100, in_stock: true, stock_quantity: 4 }] }
  assert.throws(() => buildOrder(body, catalog), /Недостаточно/)
  catalog.products[0].stock_quantity = 5
  const order = buildOrder(body, catalog)
  assert.equal(order.items.length, 1)
  assert.equal(order.items[0].qty, 5)
  assert.equal(order.total, 500)
  catalog.products[0].in_stock = false
  assert.throws(() => buildOrder(body, catalog), /недоступен/)
})

test('миграция склада: RLS, запрет отрицательного остатка, неизменяемый журнал, статусы заказов', async () => {
  const db = new PGlite()
  try {
    await db.exec(`create schema auth; create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('test.user_id', true), '')::uuid $$;`)
    for (const name of ['20261017120100_catalog.sql', '20261017130000_harden_catalog.sql', '20261017140000_orders_staff.sql', '20261017150000_inventory.sql']) {
      await db.exec(await readFile(new URL('../supabase/migrations/' + name, import.meta.url), 'utf8'))
    }
    await db.exec(`insert into auth.users values ('11111111-1111-1111-1111-111111111111');
      insert into public.admin_users(user_id) values ('11111111-1111-1111-1111-111111111111');
      insert into public.products(id,slug,name) values ('22222222-2222-2222-2222-222222222222', 'fanera', 'Фанера');
      set test.user_id = '11111111-1111-1111-1111-111111111111'; set role authenticated;`)
    await db.exec(`select public.adjust_stock('22222222-2222-2222-2222-222222222222', 10, 'receipt', 'Поставка');`)
    await assert.rejects(() => db.exec(`select public.adjust_stock('22222222-2222-2222-2222-222222222222', -11, 'write_off', 'Отгрузка');`))
    assert.equal((await db.query('select stock_quantity from public.products')).rows[0].stock_quantity, 10)
    assert.equal((await db.query('select * from public.stock_movements')).rows.length, 1)
    await assert.rejects(() => db.exec('update public.stock_movements set balance = 1'))
    await assert.rejects(() => db.exec('update public.products set stock_quantity = 2'))
    await db.exec(`insert into public.products(slug,name) values ('new-product', 'Новый товар'); update public.products set name = 'Редактирование';`)
    await db.exec(`reset role; set role anon;`)
    await assert.rejects(() => db.exec(`select public.adjust_stock('22222222-2222-2222-2222-222222222222', 1, 'receipt', 'Взлом');`))
    await assert.rejects(() => db.query('select * from public.stock_movements'))
    // Checkout inserts an explicit id and never requires anonymous SELECT permission.
    await db.exec(`insert into public.orders(id,customer_name,phone,items) values ('33333333-3333-3333-3333-333333333333','Иван','79991234567','[{"product_id":"p","qty":1}]');`)
    await assert.rejects(() => db.query('select * from public.orders'))
    await db.exec('reset role; set role authenticated;')
    await db.exec("update public.orders set status = 'processing'")
    assert.equal((await db.query('select status from public.orders')).rows[0].status, 'processing')
    await db.exec("reset role; set test.user_id = ''; set role authenticated;")
    await assert.rejects(() => db.exec(`select public.adjust_stock('22222222-2222-2222-2222-222222222222', 1, 'receipt', 'Не админ');`))
    assert.equal((await db.query('select * from public.stock_movements')).rows.length, 0)
  } finally { await db.close() }
})
