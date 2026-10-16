import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { pageSlug, stripExternalAnchors, transformHtml } from './strip-site.mjs'
import { createFileStore, slugify } from '../server/store.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('внешние ссылки снимаются, внутренние страницы остаются', () => {
  const html = `<a href="https://t.me/regles54" target="_blank">Telegram</a>
<a href="katalog.html">Каталог</a>
<a href="mailto:info@reg-les.ru">Почта</a>
<link rel="dns-prefetch" href="https://static.tildacdn.com/">`
  const next = transformHtml(html, 'o-kompanii.html')
  assert.doesNotMatch(next, /href\s*=\s*["']https?:/i)
  assert.match(next, /href="katalog.html"/)
  assert.match(next, /mailto:info@reg-les.ru/)
  assert.match(next, /Telegram/)
  assert.match(next, /\/assets\/catalog\.js/)
})

test('страница раздела получает свою витрину вместо чужих товаров', () => {
  const html = `<div id="rec1" class="r t-rec" data-record-type="396">текст</div>
<div id="rec2" class="r t-rec" data-record-type="2421">storepart:'1'</div>
<div id="rec3" class="r t-rec" data-record-type="131">подвал</div></body>`
  const next = transformHtml(html, 'katalog/listovye-materialy/osb-3.html')
  assert.equal(pageSlug('katalog/listovye-materialy/osb-3.html').slug, 'osb-3')
  assert.doesNotMatch(next, /storepart/)
  assert.match(next, /data-slug="osb-3"/)
  assert.match(next, /подвал/)
  assert.equal(slugify('ОСП-3'), 'osp-3')
})

test('локальное хранилище сохраняет товар и не затирает фото', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'koruna-'))
  const store = createFileStore(path.join(dir, 'catalog.json'))
  const category = await store.saveCategory({ name: 'Листовые материалы', slug: 'listovye-materialy' })
  const product = await store.saveProduct({
    name: 'ОСП-3',
    category_id: category.id,
    price: '1290,5',
    image_url: '/uploads/a.jpg',
  })
  const updated = await store.saveProduct({ name: 'ОСП-3 9 мм', price: '' }, product.id)
  assert.equal(updated.image_url, '/uploads/a.jpg')
  assert.equal(updated.price, null)
  const catalog = await store.catalog()
  assert.equal(catalog.products.length, 1)
  assert.equal(catalog.products[0].category_id, category.id)
  await rm(dir, { recursive: true })
})

test('миграции очищают старую базу и создают каталог', async () => {
  const db = new PGlite()
  await db.exec(`
    create schema auth;
    create table auth.users (id uuid primary key);
    create table public.leads (id uuid primary key);
    create type public.lead_type as enum ('order');
    create function public.is_admin() returns boolean language sql as $$ select true $$;
    insert into public.leads values ('44444444-4444-4444-4444-444444444444');
    create schema archive;
    create table archive.keep (id int);
    insert into archive.keep values (1);
  `)
  const clean = await readFile(path.join(root, 'supabase/migrations/20261017120000_clean_database.sql'), 'utf8')
  const catalog = await readFile(path.join(root, 'supabase/migrations/20261017120100_catalog.sql'), 'utf8')
  await db.exec(clean)
  const gone = await db.query("select to_regclass('public.leads') as leads, to_regtype('public.lead_type') as kind")
  assert.equal(gone.rows[0].leads, null)
  assert.equal(gone.rows[0].kind, null)
  const archive = await db.query('select count(*)::int as n from archive.keep')
  assert.equal(archive.rows[0].n, 1)

  await db.exec(catalog)
  await db.exec(`
    insert into public.categories (slug, name) values ('krepezh', 'Крепёж');
    insert into public.products (slug, name, category_id, price)
    select 'samorez', 'Саморез', id, 12.5 from public.categories where slug = 'krepezh';
  `)
  const rows = await db.query(`
    select p.name, c.slug
    from public.products p
    join public.categories c on c.id = p.category_id
  `)
  assert.deepEqual(rows.rows, [{ name: 'Саморез', slug: 'krepezh' }])
  await db.exec(clean)
  await db.exec(catalog)
  const empty = await db.query('select count(*)::int as n from public.products')
  assert.equal(empty.rows[0].n, 0)
})

test('stripExternalAnchors не трогает адрес без протокола', () => {
  assert.equal(stripExternalAnchors('<a href="/admin">Админка</a>'), '<a href="/admin">Админка</a>')
})
