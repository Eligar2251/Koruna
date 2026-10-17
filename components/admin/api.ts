export async function adminApi(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)
  headers.set('x-csb-request', '1')
  if (options.body) headers.set('content-type', 'application/json')
  const response = await fetch(url, { ...options, credentials: 'same-origin', cache: 'no-store', headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Ошибка запроса')
  return data
}
