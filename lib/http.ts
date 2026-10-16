import { NextResponse } from 'next/server'

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'same-origin',
    },
  })
}

export function fail(err: unknown) {
  const message = err instanceof Error ? err.message : 'Ошибка'
  const status = /не найден/i.test(message)
    ? 404
    : /уже есть|укажите|некоррект|длиннее|адрес/i.test(message)
      ? 400
      : 500
  return json({ error: message }, status)
}

export async function readJson(req: Request) {
  const text = await req.text()
  if (Buffer.byteLength(text) > 8 * 1024 * 1024) throw new Error('Слишком большой запрос')
  if (!text) return {}
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    throw new Error('Некорректный JSON')
  }
}

const ID = /^[0-9a-f-]{36}$/

export function validId(id: string) {
  return ID.test(id)
}

