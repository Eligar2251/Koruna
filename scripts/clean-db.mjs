#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  PUBLIC_LEFTOVER_SQL,
  assertDirectConnection,
  assertNotPlaceholder,
  assertServiceKey,
  assertSupabaseUrl,
  connectionTarget,
  describeTarget,
  formatTable,
  isExecutable,
  leadingKeyword,
  loadEnv,
  normalizeSupabaseUrl,
  parseArgs,
  prepareCleanSql,
  quoteIdent,
  scrub,
  splitSql,
} from './lib.mjs'
import { cleanBuckets } from './storage-clean.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sqlPath = path.join(root, 'supabase', 'clean.sql')
const APP_BUCKET = 'product-images'

const HELP = `Очистка базы Supabase проекта Koruna.

Удаляет схему public (таблицы, представления, функции, типы) и бакет ${APP_BUCKET}.
Файлы Storage удаляются через API, а не через SQL: так они стираются и в S3.

  npm run clean:dry
  npm run clean -- --yes
  npm run clean -- --yes --with-auth
  npm run clean -- --yes --all-storage --with-auth
  npm run clean -- --schema-only --yes
  npm run clean -- --storage-only --yes

Флаги:
  --dry-run           показать, что будет удалено, ничего не менять
  --yes               выполнить удаление (или переменная CONFIRM=wipe)
  --with-auth         также удалить всех пользователей Authentication
  --all-storage       очистить все бакеты, не только ${APP_BUCKET}
  --schema-only       только Postgres, без Storage API
  --storage-only      только бакеты, схему не трогать
  --keep-migrations   не очищать supabase_migrations
  --help              эта справка

Без --yes и без --dry-run команда ничего не удаляет.
`

function isDirectRun() {
  const entry = process.argv[1]
  if (!entry) return false
  return import.meta.url === pathToFileURL(entry).href
}

function secretsFrom(target, serviceKey) {
  return [target?.password, serviceKey].filter(Boolean)
}

function formatDbError(err, secrets) {
  const parts = [err.message, err.detail, err.hint, err.code].filter(Boolean)
  return scrub(parts.join('\n'), secrets)
}

function networkHint(err) {
  const code = err.code || ''
  if (code === 'ENOTFOUND' || code === 'ETIMEDOUT' || code === 'ECONNREFUSED' || /timeout/i.test(err.message || '')) {
    return (
      '\nЕсли хост db.<ref>.supabase.co не открывается, у проекта может не быть IPv4 на прямом подключении. ' +
      'Возьмите Session pooler, порт 5432: Project Settings → Database → Connection string.'
    )
  }
  return ''
}

async function importPg() {
  try {
    return (await import('pg')).default
  } catch {
    throw new Error('Не установлен пакет pg. В корне репозитория выполните npm install.')
  }
}

async function importSupabase() {
  try {
    return await import('@supabase/supabase-js')
  } catch {
    throw new Error('Не установлен пакет @supabase/supabase-js. В корне репозитория выполните npm install.')
  }
}

async function connect(connectionString, target) {
  const pg = await importPg()
  const client = new pg.Client({
    connectionString,
    connectionTimeoutMillis: 15_000,
    ssl:
      target.host === 'localhost' || target.host === '127.0.0.1'
        ? false
        : { rejectUnauthorized: false },
  })
  await client.connect()
  await client.query("set statement_timeout = '30s'")
  await client.query("set lock_timeout = '10s'")
  await client.query("set application_name = 'koruna-clean'")
  return client
}

async function inventory(client) {
  const tables = await client.query(
    "select tablename as name from pg_tables where schemaname = 'public' order by 1",
  )
  const rows = []
  for (const table of tables.rows) {
    const counted = await client.query(
      `select count(*)::bigint as n from public.${quoteIdent(table.name)}`,
    )
    rows.push({ kind: 'table', name: `public.${table.name}`, detail: `${counted.rows[0].n} rows` })
  }

  const rest = await client.query(`
    select kind, name
    from (
      select 'view'::text as kind, viewname as name from pg_views where schemaname = 'public'
      union all
      select 'materialized view', matviewname from pg_matviews where schemaname = 'public'
      union all
      select 'sequence', sequencename from pg_sequences where schemaname = 'public'
      union all
      select 'routine', p.proname
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public'
      union all
      select 'type', t.typname
      from pg_type t
      join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public' and t.typtype in ('e', 'd', 'c')
    ) objects
    order by 1, 2
  `)
  for (const row of rest.rows) rows.push({ kind: row.kind, name: `public.${row.name}`, detail: '' })
  return rows
}

function storageConfig(args) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || ''
  if (!args.storage) return { url: '', serviceKey: '' }
  if (!url || !serviceKey) {
    throw new Error(
      'Не заданы SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY. Без них файлы Storage не удаляются: SQL их не трогает, иначе объекты останутся в S3.\n' +
        'Ключ: Project Settings → API → service_role / secret.\n' +
        'Если бакета уже нет, запустите с --schema-only.',
    )
  }
  assertNotPlaceholder(url, 'SUPABASE_URL')
  assertNotPlaceholder(serviceKey, 'SUPABASE_SERVICE_ROLE_KEY')
  assertSupabaseUrl(url)
  assertServiceKey(serviceKey)
  return { url: normalizeSupabaseUrl(url), serviceKey }
}

function databaseConfig(args) {
  if (!args.schema) return null
  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || ''
  if (!connectionString) {
    throw new Error(
      'Прямое SQL-подключение не настроено. Сайт использует SUPABASE_URL и SUPABASE_ANON_KEY, без строки Postgres.\n' +
        'Для очистки схемы без строки подключения выполните supabase/clean.sql в Supabase SQL Editor.\n' +
        'Для очистки только файлов используйте --storage-only (нужен серверный service_role).\n' +
        'Устаревший режим прямого SQL поддерживает DATABASE_URL: direct connection или session pooler, порт 5432.',
    )
  }
  assertNotPlaceholder(connectionString, 'DATABASE_URL')
  const target = connectionTarget(connectionString)
  assertDirectConnection(target)
  return { connectionString, target }
}

function printPlan(args, target, schemaRows, storageReport, storageMissing) {
  console.log('ВНИМАНИЕ: удаление необратимо.')
  if (target) console.log(`Цель: ${describeTarget(target)}`)
  const scope = [
    args.schema ? 'схема public' : null,
    args.storage ? (args.allStorage ? 'все бакеты Storage' : `бакет ${APP_BUCKET}`) : null,
    args.withAuth ? 'пользователи Authentication' : null,
  ].filter(Boolean)
  console.log(`Будет затронуто: ${scope.join(', ') || 'ничего'}.`)
  if (!args.withAuth && args.schema) console.log('Пользователи Authentication не удаляются. Для этого нужен --with-auth.')
  console.log('')

  if (args.schema) {
    console.log('Схема public:')
    console.log(formatTable(schemaRows, ['kind', 'name', 'detail']))
    console.log('')
  }

  if (args.storage) {
    console.log('Storage:')
    if (storageReport.length) console.log(formatTable(storageReport, ['bucket', 'action']))
    else console.log('(бакетов по выбранному фильтру нет)')
    if (storageMissing.length) console.log(`Уже отсутствуют: ${storageMissing.join(', ')}`)
    console.log('')
  }
}

async function runSchema(client, sql, secrets) {
  let inTransaction = false
  let log = []
  try {
    for (const statement of splitSql(sql)) {
      if (!isExecutable(statement)) continue
      const keyword = leadingKeyword(statement)
      const result = await client.query(statement)
      if (keyword === 'begin') inTransaction = true
      if (keyword === 'commit' || keyword === 'rollback') inTransaction = false
      if (result.rows?.length && result.fields?.some((field) => field.name === 'action')) {
        log = result.rows
      }
    }
  } catch (err) {
    if (inTransaction) {
      try {
        await client.query('rollback')
      } catch {
        // Соединение уже могло оборваться. Исходная ошибка важнее.
      }
    }
    const wrapped = new Error(formatDbError(err, secrets))
    wrapped.cause = err
    throw wrapped
  }
  return log
}

async function main() {
  const [major] = process.versions.node.split('.').map(Number)
  if (major < 20) {
    console.error('Нужен Node.js 20 или новее.')
    process.exit(1)
  }

  let args
  try {
    args = parseArgs(process.argv.slice(2))
  } catch (err) {
    console.error(err.message)
    process.exit(2)
  }

  if (args.help) {
    console.log(HELP)
    return
  }

  if (!args.dryRun && !args.yes && process.argv.slice(2).length === 0) {
    console.log(HELP)
    console.log('Команда ничего не удалила.')
    process.exit(2)
  }

  loadEnv(root)

  let db
  let storage
  try {
    db = databaseConfig(args)
    storage = storageConfig(args)
  } catch (err) {
    console.error(err.message)
    process.exit(2)
  }

  const secrets = secretsFrom(db?.target, storage.serviceKey)
  let client
  let schemaRows = []
  let storageReport = []
  let storageMissing = []

  try {
    if (db) {
      client = await connect(db.connectionString, db.target)
      const session = await client.query('select current_user as user, current_database() as database, version() as version')
      const version = String(session.rows[0].version).split(' ').slice(0, 2).join(' ')
      console.log(`Подключение: ${session.rows[0].user}@${describeTarget(db.target)} (${version})`)
      schemaRows = await inventory(client)
    }

    if (args.storage) {
      const { createClient } = await importSupabase()
      const supabase = createClient(storage.url, storage.serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      })
      const cleaned = await cleanBuckets(supabase.storage, {
        buckets: [APP_BUCKET],
        all: args.allStorage,
        dryRun: true,
      })
      storageReport = cleaned.report
      storageMissing = cleaned.missing
    }
  } catch (err) {
    console.error(formatDbError(err, secrets) + networkHint(err))
    process.exitCode = 1
  } finally {
    if (client) {
      try {
        await client.end()
      } catch {
        // Соединение уже закрыто.
      }
      client = null
    }
  }

  if (process.exitCode) return

  printPlan(args, db?.target, schemaRows, storageReport, storageMissing)

  if (args.dryRun || !args.yes) {
    console.log(args.dryRun ? 'Режим --dry-run: база не изменена.' : 'База не изменена. Добавьте --yes, чтобы выполнить.')
    process.exit(args.dryRun ? 0 : 2)
  }

  try {
    if (args.storage) {
      const { createClient } = await importSupabase()
      const supabase = createClient(storage.url, storage.serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      })
      const cleaned = await cleanBuckets(supabase.storage, {
        buckets: [APP_BUCKET],
        all: args.allStorage,
        dryRun: false,
      })
      console.log('Storage:')
      console.log(formatTable(cleaned.report, ['bucket', 'action', 'method']))
      if (cleaned.missing.length) console.log(`Уже отсутствуют: ${cleaned.missing.join(', ')}`)
    }

    if (db) {
      if (!client) client = await connect(db.connectionString, db.target)
      const sql = prepareCleanSql(readFileSync(sqlPath, 'utf8'), {
        withAuth: args.withAuth,
        allStoragePolicies: args.allStorage,
        keepMigrations: args.keepMigrations,
      })
      const log = await runSchema(client, sql, secrets)
      console.log('')
      console.log('Postgres:')
      console.log(formatTable(log, ['step', 'action', 'object']))

      const storageLeft = log.find((row) => row.action === 'storage left')
      if (storageLeft && !/rows: 0\b/.test(String(storageLeft.object))) {
        console.error('В Storage остались объекты product-images. Удалите бакет через API или Dashboard, не через SQL.')
      }

      const leftover = await client.query(PUBLIC_LEFTOVER_SQL)
      if (leftover.rows.length) {
        console.error('')
        console.error('После очистки в public ещё остались объекты:')
        console.error(formatTable(leftover.rows, ['kind', 'name']))
        process.exitCode = 1
        return
      }
      console.log('')
      console.log('Схема public пуста.')
    }
  } catch (err) {
    console.error(formatDbError(err, secrets) + networkHint(err))
    if (args.withAuth) {
      console.error('Если ошибка связана с auth.users и внешним ключом storage, повторите с --all-storage --with-auth.')
    }
    process.exitCode = 1
  } finally {
    if (client) {
      try {
        await client.end()
      } catch {
        // Соединение уже закрыто.
      }
    }
  }
}

if (isDirectRun()) {
  main()
    .then(() => {
      process.exit(process.exitCode ?? 0)
    })
    .catch((err) => {
      console.error(err?.message || err)
      process.exit(1)
    })
}
