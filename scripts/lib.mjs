import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

export function splitSql(source) {
  const statements = []
  let current = ''
  let i = 0
  let dollarTag = null

  while (i < source.length) {
    const ch = source[i]
    const next = source[i + 1]

    if (dollarTag) {
      if (source.startsWith(dollarTag, i)) {
        current += dollarTag
        i += dollarTag.length
        dollarTag = null
        continue
      }
      current += ch
      i += 1
      continue
    }

    if (ch === '-' && next === '-') {
      const end = source.indexOf('\n', i)
      const slice = end === -1 ? source.slice(i) : source.slice(i, end + 1)
      current += slice
      i += slice.length
      continue
    }

    if (ch === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2)
      const slice = end === -1 ? source.slice(i) : source.slice(i, end + 2)
      current += slice
      i += slice.length
      continue
    }

    if (ch === "'") {
      current += ch
      i += 1
      while (i < source.length) {
        current += source[i]
        if (source[i] === "'") {
          if (source[i + 1] === "'") {
            current += source[i + 1]
            i += 2
            continue
          }
          i += 1
          break
        }
        i += 1
      }
      continue
    }

    if (ch === '"') {
      current += ch
      i += 1
      while (i < source.length) {
        current += source[i]
        if (source[i] === '"') {
          if (source[i + 1] === '"') {
            current += source[i + 1]
            i += 2
            continue
          }
          i += 1
          break
        }
        i += 1
      }
      continue
    }

    if (ch === '$') {
      const match = /^\$[A-Za-z0-9_]*\$/.exec(source.slice(i))
      if (match) {
        dollarTag = match[0]
        current += dollarTag
        i += dollarTag.length
        continue
      }
    }

    if (ch === ';') {
      const statement = current.trim()
      if (statement) statements.push(statement)
      current = ''
      i += 1
      continue
    }

    current += ch
    i += 1
  }

  const tail = current.trim()
  if (tail) statements.push(tail)
  return statements
}

export function leadingKeyword(statement) {
  let rest = statement
  for (;;) {
    rest = rest.trimStart()
    if (rest.startsWith('--')) {
      const nl = rest.indexOf('\n')
      rest = nl === -1 ? '' : rest.slice(nl + 1)
      continue
    }
    if (rest.startsWith('/*')) {
      const end = rest.indexOf('*/')
      rest = end === -1 ? '' : rest.slice(end + 2)
      continue
    }
    break
  }
  const match = /^[a-zA-Z]+/.exec(rest)
  return match ? match[0].toLowerCase() : ''
}

export function isExecutable(statement) {
  return leadingKeyword(statement) !== ''
}

export function quoteIdent(name) {
  return `"${String(name).replaceAll('"', '""')}"`
}

export function loadEnv(root) {
  for (const name of ['.env', '.env.local']) {
    const file = path.join(root, name)
    if (!existsSync(file)) continue
    const text = readFileSync(file, 'utf8')
    for (const rawLine of text.split('\n')) {
      let line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      if (line.startsWith('export ')) line = line.slice(7).trim()
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const key = line.slice(0, eq).trim()
      let value = line.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (process.env[key] === undefined) process.env[key] = value
    }
  }
}

export function connectionTarget(connectionString) {
  let url
  try {
    url = new URL(connectionString.replace(/^postgres(ql)?:/i, 'http:'))
  } catch {
    throw new Error(
      'DATABASE_URL не разбирается как URI. Если в пароле есть @, # или :, закодируйте их (например @ → %40).',
    )
  }
  return {
    host: url.hostname,
    port: url.port || '5432',
    database: decodeURIComponent(url.pathname.replace(/^\//, '') || 'postgres'),
    user: decodeURIComponent(url.username || ''),
    password: decodeURIComponent(url.password || ''),
  }
}

export function describeTarget(target) {
  return `${target.host}:${target.port}/${target.database}`
}

export function assertDirectConnection(target) {
  if (target.port === '6543') {
    throw new Error(
      'Порт 6543 — transaction pooler. Для DDL он не подходит. Возьмите Direct connection или Session pooler, порт 5432.',
    )
  }
}

export function assertNotPlaceholder(value, label) {
  if (!value || /YOUR_PASSWORD|YOUR_PROJECT_REF|your-service-role-key|your-anon-key/i.test(value)) {
    throw new Error(`${label} всё ещё содержит плейсхолдер из .env.example.`)
  }
}

export function jwtRole(key) {
  const parts = String(key).split('.')
  if (parts.length < 3) return null
  try {
    const json = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
    return typeof json.role === 'string' ? json.role : null
  } catch {
    return null
  }
}

export function assertServiceKey(key) {
  if (key.startsWith('sb_publishable_')) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY — publishable-ключ. Нужен secret / service_role.')
  }
  const role = jwtRole(key)
  if (role === 'anon' || role === 'authenticated') {
    throw new Error(`SUPABASE_SERVICE_ROLE_KEY имеет роль ${role}. Нужен service_role.`)
  }
}

export function assertSupabaseUrl(url) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    throw new Error('SUPABASE_URL не является URL.')
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('SUPABASE_URL должен начинаться с https://.')
  }
  if (parsed.protocol === 'http:' && !['localhost', '127.0.0.1'].includes(parsed.hostname)) {
    throw new Error('SUPABASE_URL по http допустим только для localhost.')
  }
}

export function normalizeSupabaseUrl(url) {
  return url.trim().replace(/\/+$/, '')
}

export function scrub(text, secrets) {
  let out = String(text)
  const unique = [...new Set(secrets.filter((secret) => secret && secret.length >= 4))]
  unique.sort((a, b) => b.length - a.length)
  for (const secret of unique) out = out.split(secret).join('***')
  return out
}

export function parseArgs(argv, env = process.env) {
  const args = {
    yes: env.CONFIRM === 'wipe',
    dryRun: false,
    withAuth: false,
    allStorage: false,
    schemaOnly: false,
    storageOnly: false,
    keepMigrations: false,
    help: false,
  }

  for (const arg of argv) {
    switch (arg) {
      case '--yes':
        args.yes = true
        break
      case '--dry-run':
        args.dryRun = true
        break
      case '--with-auth':
        args.withAuth = true
        break
      case '--all-storage':
        args.allStorage = true
        break
      case '--schema-only':
        args.schemaOnly = true
        break
      case '--storage-only':
        args.storageOnly = true
        break
      case '--keep-migrations':
        args.keepMigrations = true
        break
      case '--help':
      case '-h':
        args.help = true
        break
      default:
        throw new Error(`Неизвестный аргумент: ${arg}`)
    }
  }

  if (args.schemaOnly && args.storageOnly) {
    throw new Error('Флаги --schema-only и --storage-only вместе не используются.')
  }
  if (args.storageOnly && args.withAuth) {
    throw new Error('--with-auth удаляет пользователей через SQL и не сочетается с --storage-only.')
  }
  if (args.dryRun) args.yes = false

  args.schema = !args.storageOnly
  args.storage = !args.schemaOnly
  return args
}

export const PUBLIC_LEFTOVER_SQL = `
  select kind, name
  from (
    select 'table'::text as kind, tablename as name
    from pg_tables
    where schemaname = 'public'
    union all
    select 'view', viewname
    from pg_views
    where schemaname = 'public'
    union all
    select 'materialized view', matviewname
    from pg_matviews
    where schemaname = 'public'
    union all
    select 'sequence', sequencename
    from pg_sequences
    where schemaname = 'public'
    union all
    select 'routine', p.proname
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and not exists (
        select 1
        from pg_depend d
        where d.classid = 'pg_proc'::regclass
          and d.objid = p.oid
          and d.deptype = 'e'
      )
    union all
    select 'type', t.typname
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typtype in ('e', 'd', 'c')
      and not exists (
        select 1
        from pg_depend d
        where d.classid = 'pg_type'::regclass
          and d.objid = t.oid
          and d.deptype = 'e'
      )
  ) leftover
  order by 1, 2
`

const AUTH_SQL = `
do $auth$
declare
  n bigint;
begin
  if to_regclass('auth.users') is null then
    insert into _clean_log (action, object) values ('skip', 'auth.users отсутствует');
    return;
  end if;
  delete from auth.users;
  get diagnostics n = row_count;
  insert into _clean_log (action, object) values ('delete', 'auth.users (' || n || ' rows)');
end
$auth$;
`

const ALL_STORAGE_POLICIES_SQL = `
do $policies$
declare
  pol record;
begin
  if to_regclass('pg_catalog.pg_policies') is null then
    return;
  end if;
  for pol in
    select policyname, tablename
    from pg_policies
    where schemaname = 'storage'
      and tablename in ('objects', 'buckets')
  loop
    execute format('drop policy if exists %I on storage.%I', pol.policyname, pol.tablename);
    insert into _clean_log (action, object)
    values ('drop policy', 'storage.' || pol.tablename || '.' || pol.policyname);
  end loop;
end
$policies$;
`

export function prepareCleanSql(source, options = {}) {
  if (!source.includes('-- __OPTIONAL_SQL__')) {
    throw new Error('В supabase/clean.sql нет маркера -- __OPTIONAL_SQL__')
  }
  if (!source.includes('-- __MIGRATIONS_START__') || !source.includes('-- __MIGRATIONS_END__')) {
    throw new Error('В supabase/clean.sql нет маркеров блока миграций')
  }

  let sql = source
  if (options.keepMigrations) {
    sql = sql.replace(/-- __MIGRATIONS_START__[\s\S]*?-- __MIGRATIONS_END__/, '-- migrations kept')
  }

  const extras = []
  if (options.allStoragePolicies) extras.push(ALL_STORAGE_POLICIES_SQL.trim())
  if (options.withAuth) extras.push(AUTH_SQL.trim())
  sql = sql.replace('-- __OPTIONAL_SQL__', extras.join('\n\n') || '-- no optional sql')
  return sql
}

export function formatTable(rows, columns) {
  if (!rows.length) return '(пусто)'
  const widths = columns.map((column) =>
    Math.max(column.length, ...rows.map((row) => String(row[column] ?? '').length)),
  )
  const line = (values) => values.map((value, index) => String(value).padEnd(widths[index])).join('  ')
  return [line(columns), ...rows.map((row) => line(columns.map((column) => row[column] ?? '')))].join('\n')
}

export function executableSql(source) {
  return splitSql(source).filter(isExecutable).join('\n')
}

export function stripComments(source) {
  let out = ''
  let i = 0
  let dollarTag = null

  while (i < source.length) {
    const ch = source[i]
    const next = source[i + 1]

    if (dollarTag) {
      if (source.startsWith(dollarTag, i)) {
        out += dollarTag
        i += dollarTag.length
        dollarTag = null
        continue
      }
      out += ch
      i += 1
      continue
    }

    if (ch === '-' && next === '-') {
      const end = source.indexOf('\n', i)
      i = end === -1 ? source.length : end
      continue
    }

    if (ch === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2)
      i = end === -1 ? source.length : end + 2
      out += ' '
      continue
    }

    if (ch === "'" || ch === '"') {
      const quote = ch
      out += ch
      i += 1
      while (i < source.length) {
        out += source[i]
        if (source[i] === quote) {
          if (source[i + 1] === quote) {
            out += source[i + 1]
            i += 2
            continue
          }
          i += 1
          break
        }
        i += 1
      }
      continue
    }

    if (ch === '$') {
      const match = /^\$[A-Za-z0-9_]*\$/.exec(source.slice(i))
      if (match) {
        dollarTag = match[0]
        out += dollarTag
        i += dollarTag.length
        continue
      }
    }

    out += ch
    i += 1
  }

  return out
}
