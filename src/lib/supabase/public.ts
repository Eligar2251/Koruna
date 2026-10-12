import { createClient } from '@supabase/supabase-js'
import { getSupabaseEnv } from './env'

// Клиент без cookies для публичных выборок: страницы каталога могут кешироваться.
export function createPublicClient() {
  const env = getSupabaseEnv()
  if (!env) throw new Error('Supabase не настроен: проверьте переменные окружения')
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
