// Проверка миграций на локальном Postgres (PGlite) с заглушками схем auth и storage Supabase.
// Запуск: pnpm db:test
import { PGlite } from '@electric-sql/pglite'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const migrationsDir = join(root, 'supabase', 'migrations')

const db = new PGlite()

await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid());
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  create schema storage;
  create table storage.buckets (
    id text primary key, name text, public boolean,
    file_size_limit bigint, allowed_mime_types text[]
  );
  create table storage.objects (
    id uuid primary key default gen_random_uuid(),
    bucket_id text references storage.buckets (id), name text
  );
  alter table storage.objects enable row level security;
  grant usage on schema public, storage, auth to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on sequences to anon, authenticated;
  grant all on storage.objects, storage.buckets to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;
`)

const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()
for (const file of files) {
  await db.exec(readFileSync(join(migrationsDir, file), 'utf8'))
  console.log('ok  migration', file)
}

let failed = 0
const check = async (name, fn) => {
  try {
    await fn()
    console.log('ok  test   ', name)
  } catch (e) {
    failed++
    console.log('FAIL test   ', name, '-', e.message)
  }
}
const expectError = async (sql) => {
  let err = null
  try { await db.exec(sql) } catch (e) { err = e }
  if (!err) throw new Error('ожидалась ошибка: ' + sql.slice(0, 80))
}
const asRole = async (role, sub, sql) => {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${sub ?? ''}', false);`)
  await db.exec(`set role ${role}; ${sql}; reset role;`)
}
const count = async (sql) => {
  const r = await db.query(sql)
  return Number(r.rows[0].n)
}

const adminId = '00000000-0000-4000-8000-000000000001'
const userId = '00000000-0000-4000-8000-000000000002'
await db.exec(`
  insert into auth.users (id) values ('${adminId}'), ('${userId}');
  insert into public.admin_users (user_id) values ('${adminId}');
  insert into public.products (slug, name, is_active) values ('test-active', 'Активный', true), ('test-draft', 'Черновик', false);
`)

await check('гость видит только активные товары', async () => {
  await asRole('anon', '', '')
  await db.exec(`reset role; set role anon;`)
  const n = await count(`select count(*) as n from public.products`)
  await db.exec('reset role')
  if (n !== 1) throw new Error('видно товаров: ' + n)
})

await check('гость может отправить корректную заявку', async () => {
  await db.exec(`
    reset role; set role anon;
    insert into public.leads (type, name, phone, preferred_contact, consent_pd, consent_version)
    values ('callback', 'Иван', '+79000000000', 'phone', true, '1.0');
    reset role;
  `)
})

await check('заявка без согласия на обработку ПД отклоняется', async () => {
  await expectError(`
    reset role; set role anon;
    insert into public.leads (type, name, phone, preferred_contact, consent_pd, consent_version)
    values ('callback', 'Иван', '+79000000000', 'phone', false, '1.0');
  `)
})

await check('заявка без телефона и почты отклоняется', async () => {
  await expectError(`
    reset role; set role anon;
    insert into public.leads (type, name, preferred_contact, consent_pd, consent_version)
    values ('contact', 'Иван', 'phone', true, '1.0');
  `)
})

await check('гость не может читать заявки', async () => {
  await expectError(`reset role; set role anon; select * from public.leads; reset role;`)
})

await check('обычный пользователь не видит заявки', async () => {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${userId}', false); set role authenticated;`)
  const n = await count(`select count(*) as n from public.leads`)
  await db.exec('reset role')
  if (n !== 0) throw new Error('видно заявок: ' + n)
})

await check('админ видит заявки и товары-черновики', async () => {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${adminId}', false); set role authenticated;`)
  const leads = await count(`select count(*) as n from public.leads`)
  const products = await count(`select count(*) as n from public.products`)
  await db.exec('reset role')
  if (leads !== 1 || products !== 2) throw new Error(`leads=${leads} products=${products}`)
})

await check('админ может опубликовать товар, обычный пользователь — нет', async () => {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${userId}', false); set role authenticated;`)
  await db.exec(`update public.products set is_active = true where slug = 'test-draft'`)
  await db.exec('reset role')
  const still = await count(`select count(*) as n from public.products where is_active`)
  if (still !== 1) throw new Error('обычный пользователь изменил товар')
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${adminId}', false); set role authenticated;`)
  await db.exec(`update public.products set is_active = true where slug = 'test-draft'`)
  await db.exec('reset role')
  const after = await count(`select count(*) as n from public.products where is_active`)
  if (after !== 2) throw new Error('админ не смог опубликовать товар')
})

await check('поле updated_at обновляется триггером', async () => {
  const r = await db.query(`select updated_at = created_at as same from public.products where slug = 'test-draft'`)
  if (r.rows[0].same !== false) throw new Error('updated_at не изменился')
})

await check('фото товаров: гость не может загружать', async () => {
  await db.exec(`insert into storage.buckets (id, name) values ('product-images', 'product-images') on conflict do nothing`)
  await expectError(`reset role; set role anon; insert into storage.objects (bucket_id, name) values ('product-images', 'x.jpg'); reset role;`)
})

await db.close()
if (failed) {
  console.log(`\nПроверка не пройдена: ${failed}`)
  process.exit(1)
}
console.log('\nВсе проверки пройдены')
