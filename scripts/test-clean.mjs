import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import {
  PUBLIC_LEFTOVER_SQL,
  assertServiceKey,
  connectionTarget,
  executableSql,
  jwtRole,
  leadingKeyword,
  parseArgs,
  prepareCleanSql,
  scrub,
  splitSql,
  stripComments,
} from './lib.mjs'
import { cleanBuckets, collectObjectPaths, isFolder } from './storage-clean.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cleanSql = readFileSync(path.join(root, 'supabase', 'clean.sql'), 'utf8')

test('splitSql не режет dollar-quote и комментарии с точкой с запятой', () => {
  const parts = splitSql("-- foo; bar\nselect 1;\ndo $$\nbegin\n  perform 1;\nend\n$$;\nselect 2;")
  assert.equal(parts.length, 3)
  assert.match(parts[0], /foo; bar/)
  assert.match(parts[0], /select 1/)
  assert.match(parts[1], /perform 1;/)
  assert.equal(leadingKeyword(parts[2]), 'select')
  assert.equal(leadingKeyword('-- только комментарий'), '')
})

test('исполняемый SQL не удаляет storage.objects и auth.users', () => {
  const active = stripComments(executableSql(prepareCleanSql(cleanSql)))
  assert.doesNotMatch(active, /delete\s+from\s+storage\.(objects|buckets)/i)
  assert.doesNotMatch(active, /delete\s+from\s+auth\.users/i)
  assert.match(stripComments(executableSql(prepareCleanSql(cleanSql, { withAuth: true }))), /delete\s+from\s+auth\.users/i)
  assert.doesNotMatch(
    stripComments(executableSql(prepareCleanSql(cleanSql, { withAuth: true, allStoragePolicies: true }))),
    /delete\s+from\s+storage\.objects/i,
  )
  assert.doesNotMatch(stripComments(executableSql(prepareCleanSql(cleanSql, { keepMigrations: true }))), /supabase_migrations/i)
})

test('parseArgs не включает удаление без явного флага', () => {
  const dry = parseArgs(['--dry-run', '--yes'], {})
  assert.equal(dry.dryRun, true)
  assert.equal(dry.yes, false)
  assert.equal(parseArgs([], { CONFIRM: 'wipe' }).yes, true)
  assert.throws(() => parseArgs(['--schema-only', '--storage-only'], {}))
  assert.throws(() => parseArgs(['--storage-only', '--with-auth'], {}))
  assert.throws(() => parseArgs(['--drop-cluster'], {}))
})

test('ключи и строка подключения проверяются до подключения', () => {
  assert.equal(jwtRole('nope'), null)
  const anon = fakeJwt({ role: 'anon' })
  assert.equal(jwtRole(anon), 'anon')
  assert.throws(() => assertServiceKey(anon), /anon/)
  assert.throws(() => assertServiceKey('sb_publishable_test'), /publishable/)
  assert.doesNotThrow(() => assertServiceKey(fakeJwt({ role: 'service_role' })))
  assert.doesNotThrow(() => assertServiceKey('sb_secret_test'))

  const target = connectionTarget('postgresql://postgres.ref:p%40ss@db.example.supabase.co:5432/postgres')
  assert.equal(target.password, 'p@ss')
  assert.equal(target.port, '5432')
  assert.equal(target.database, 'postgres')
  assert.equal(scrub(`password p@ss key ${anon}`, [target.password, anon]).includes('p@ss'), false)
})

test('clean.sql очищает public и не трогает другие схемы и файлы storage', async () => {
  const db = new PGlite()
  await seed(db)
  await runSql(db, prepareCleanSql(cleanSql))

  const leftover = await db.query(PUBLIC_LEFTOVER_SQL)
  assert.deepEqual(leftover.rows, [])

  const archive = await db.query('select count(*)::int as n from archive.keep')
  assert.equal(archive.rows[0].n, 1)

  const files = await db.query("select count(*)::int as n from storage.objects where bucket_id = 'product-images'")
  assert.equal(files.rows[0].n, 1)

  const policies = await db.query("select count(*)::int as n from pg_policies where schemaname = 'storage'")
  assert.equal(policies.rows[0].n, 1, 'чужая политика storage должна остаться')

  const appPolicy = await db.query(
    "select count(*)::int as n from pg_policies where policyname = 'product_images_public_read'",
  )
  assert.equal(appPolicy.rows[0].n, 0)

  const users = await db.query('select count(*)::int as n from auth.users')
  assert.equal(users.rows[0].n, 1)

  const migrations = await db.query('select count(*)::int as n from supabase_migrations.schema_migrations')
  assert.equal(migrations.rows[0].n, 0)

  await runSql(db, prepareCleanSql(cleanSql))
  const leftoverAgain = await db.query(PUBLIC_LEFTOVER_SQL)
  assert.deepEqual(leftoverAgain.rows, [])
})

test('--with-auth удаляет пользователей, --all-storage снимает остальные политики', async () => {
  const db = new PGlite()
  await seed(db)
  await runSql(db, prepareCleanSql(cleanSql, { withAuth: true, allStoragePolicies: true }))

  const users = await db.query('select count(*)::int as n from auth.users')
  assert.equal(users.rows[0].n, 0)
  const policies = await db.query("select count(*)::int as n from pg_policies where schemaname = 'storage'")
  assert.equal(policies.rows[0].n, 0)
  const files = await db.query('select count(*)::int as n from storage.objects')
  assert.equal(files.rows[0].n, 1)
})

test('обход бакета отличает папки от файлов и склеивает страницы', async () => {
  const tree = {
    '': [
      { name: 'products', id: null },
      { name: 'readme.txt', id: '1' },
    ],
    products: [
      { name: 'a.jpg', id: '2' },
      { name: 'nested', id: null },
    ],
    'products/nested': [{ name: 'b.png', id: '3' }],
  }
  const paths = await collectObjectPaths(async (prefix, { limit, offset }) => {
    const page = tree[prefix] ?? []
    return page.slice(offset, offset + limit)
  }, { pageSize: 1 })
  assert.deepEqual(paths.sort(), ['products/a.jpg', 'products/nested/b.png', 'readme.txt'])
  assert.equal(isFolder({ name: 'products', id: null }), true)
  assert.equal(isFolder({ name: 'a.jpg', id: '2' }), false)
})

test('если emptyBucket недоступен, файлы удаляются списком', async () => {
  const removed = []
  const storage = {
    async listBuckets() {
      return { data: [{ id: 'product-images', name: 'product-images' }], error: null }
    },
    async emptyBucket() {
      return { data: null, error: { message: 'method not allowed' } }
    },
    from() {
      return {
        async list(prefix, { limit, offset }) {
          const page = prefix === '' ? [{ name: 'products/a.jpg', id: '1' }] : []
          return { data: page.slice(offset, offset + limit), error: null }
        },
        async remove(paths) {
          removed.push(...paths)
          return { error: null }
        },
      }
    },
    async deleteBucket(id) {
      removed.push(`bucket:${id}`)
      return { data: {}, error: null }
    },
  }
  const cleaned = await cleanBuckets(storage, { buckets: ['product-images'] })
  assert.deepEqual(removed, ['products/a.jpg', 'bucket:product-images'])
  assert.equal(cleaned.report[0].method, 'list')
})

test('Storage API чистит только запрошенный бакет и не пишет SQL', async () => {
  const calls = []
  const storage = {
    async listBuckets() {
      return {
        data: [
          { id: 'product-images', name: 'product-images' },
          { id: 'other', name: 'other' },
        ],
        error: null,
      }
    },
    async emptyBucket(id) {
      calls.push(['empty', id])
      return { data: {}, error: null }
    },
    async deleteBucket(id) {
      calls.push(['delete', id])
      return { data: {}, error: null }
    },
  }
  const cleaned = await cleanBuckets(storage, { buckets: ['product-images'] })
  assert.deepEqual(calls, [
    ['empty', 'product-images'],
    ['delete', 'product-images'],
  ])
  assert.deepEqual(cleaned.missing, [])

  const dry = await cleanBuckets(storage, { buckets: ['missing'], dryRun: true })
  assert.deepEqual(dry.missing, ['missing'])
  assert.equal(calls.length, 2)
})

function fakeJwt(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `eyJhbGciOiJIUzI1NiJ9.${body}.sig`
}

async function seed(db) {
  await db.exec(`
    create schema auth;
    create table auth.users (
      id uuid primary key,
      email text
    );
    insert into auth.users values ('11111111-1111-1111-1111-111111111111', 'admin@example.ru');

    create schema storage;
    create table storage.buckets (
      id text primary key,
      name text
    );
    create table storage.objects (
      id uuid primary key,
      bucket_id text references storage.buckets (id),
      name text
    );
    alter table storage.objects enable row level security;
    insert into storage.buckets values ('product-images', 'product-images');
    insert into storage.objects values (
      '22222222-2222-2222-2222-222222222222',
      'product-images',
      'products/a.jpg'
    );

    create table public.admin_users (
      user_id uuid primary key references auth.users (id) on delete cascade
    );
    insert into public.admin_users values ('11111111-1111-1111-1111-111111111111');

    create function public.is_admin()
    returns boolean
    language sql
    stable
    as $$ select true $$;

    create function public.set_updated_at()
    returns trigger
    language plpgsql
    as $$ begin return new; end $$;

    create table public.categories (
      id uuid primary key,
      slug text unique
    );
    insert into public.categories values ('33333333-3333-3333-3333-333333333333', 'krepezh');

    create type public.lead_type as enum ('order', 'callback', 'contact');
    create type public.lead_status as enum ('new', 'in_progress', 'done', 'cancelled');
    create table public.leads (
      id uuid primary key,
      type public.lead_type not null
    );
    insert into public.leads values ('44444444-4444-4444-4444-444444444444', 'order');
    create view public.lead_ids as select id from public.leads;
    create sequence public.orphan_seq;

    create schema archive;
    create table archive.keep (id int);
    insert into archive.keep values (1);

    create policy product_images_public_read on storage.objects
    for select using (bucket_id = 'product-images');
    create policy product_images_admin_delete on storage.objects
    for delete using (bucket_id = 'product-images' and public.is_admin());
    create policy other_bucket_read on storage.objects
    for select using (bucket_id = 'avatars');

    create schema supabase_migrations;
    create table supabase_migrations.schema_migrations (version text primary key);
    insert into supabase_migrations.schema_migrations values ('20261012100000');
  `)
}

async function runSql(db, sql) {
  for (const statement of splitSql(sql)) {
    if (!leadingKeyword(statement)) continue
    await db.exec(statement)
  }
}
