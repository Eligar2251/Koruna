export function readSupabaseConfig(env = process.env) {
  const url = (env.SUPABASE_URL || '').trim()
  const key = (env.SUPABASE_ANON_KEY || '').trim()
  const emptyUrl = !url || url.includes('YOUR_PROJECT_REF')
  const emptyKey = !key || key === 'your-anon-key'
  if (emptyUrl && emptyKey) return null
  if (emptyUrl || emptyKey) throw new Error('Заполните SUPABASE_URL и SUPABASE_ANON_KEY. Частичная настройка Supabase не допускается.')
  let parsed
  try { parsed = new URL(url) } catch { throw new Error('Некорректный SUPABASE_URL') }
  if (parsed.username || parsed.password || parsed.search || parsed.hash || (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname)))) throw new Error('Некорректный SUPABASE_URL')
  let role = ''
  try { role = JSON.parse(Buffer.from(key.split('.')[1] || '', 'base64url').toString('utf8')).role } catch { /* publishable keys are not JWTs */ }
  if (role === 'service_role' || key.startsWith('sb_secret_') || /service.role/i.test(key)) throw new Error('В SUPABASE_ANON_KEY нужен anon / publishable key, не service_role / secret.')
  return { url: url.replace(/\/+$/, ''), key }
}
