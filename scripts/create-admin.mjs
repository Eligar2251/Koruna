#!/usr/bin/env node
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { Writable } from 'node:stream'
import { createClient } from '@supabase/supabase-js'
import { createAccountBook } from '../server/accounts.mjs'
import { readSupabaseConfig } from '../server/supabase-config.mjs'
import { loadEnv } from './lib.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
loadEnv(root)
const args = process.argv.slice(2)
if (args.includes('--help')) {
  console.log('npm run admin:create [-- --email admin@example.ru] [--reset] [--password-stdin]\nПароль вводится скрыто. --reset меняет пароль существующего локального администратора.\nДля Supabase создаёт пользователя Auth и выводит SQL для назначения первого администратора в SQL Editor. Service role и DATABASE_URL не требуются.')
  process.exit(0)
}
let muted = false
const output = new Writable({ write(chunk, encoding, callback) { if (!muted) process.stdout.write(chunk, encoding); callback() } })
const rl = args.includes('--password-stdin') ? null : createInterface({ input: process.stdin, output, terminal: Boolean(process.stdin.isTTY) })
try {
  const emailArg = args.indexOf('--email')
  const email = (emailArg >= 0 ? args[emailArg + 1] || '' : (await rl?.question('Почта администратора: ')) || '').trim().toLowerCase()
  let password
  if (args.includes('--password-stdin')) {
    let input = ''
    for await (const chunk of process.stdin) input += chunk
    password = input.replace(/\r?\n$/, '')
  } else {
    process.stdout.write('Пароль (не отображается): '); muted = true
    password = await rl.question(''); muted = false; process.stdout.write('\n')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 200) throw new Error('Укажите почту и пароль от 8 до 200 символов')
  const remote = readSupabaseConfig()
  if (remote) {
    if (args.includes('--reset')) throw new Error('Пароль пользователя Supabase меняется через Authentication в Dashboard.')
    const client = createClient(remote.url, remote.key, { auth: { persistSession: false, autoRefreshToken: false } })
    const signed = await client.auth.signInWithPassword({ email, password })
    const created = signed.data.user ? signed : await client.auth.signUp({ email, password })
    const id = created.data.user?.id
    if (created.error || !id || !/^[0-9a-f-]{36}$/.test(id)) throw new Error('Не удалось создать пользователя Supabase. Проверьте регистрацию в Auth либо создайте пользователя вручную в Dashboard.')
    console.log(`Пользователь Auth найден/создан. Подтвердите почту, если это требуется настройками проекта.\nВыполните в SQL Editor (не публикуйте SQL как API):\ninsert into public.admin_users (user_id) values ('${id}') on conflict do nothing;\nПосле выполнения SQL входите в /admin с заданными почтой и паролем.`)
  } else {
    const book = createAccountBook(path.join(root, 'data', 'admins.json'))
    if (args.includes('--reset')) await book.resetPassword(email, password)
    else await book.create({ email, name: 'Администратор', password })
    console.log('Локальный администратор сохранён. Вход: /admin с указанными почтой и паролем. Пароль в открытом виде не сохранён.')
  }
} catch (err) { console.error(err.message); process.exitCode = 1 }
finally { muted = false; rl?.close() }
