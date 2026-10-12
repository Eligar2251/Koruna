import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import { getSupabaseEnv } from '@/lib/supabase/env'
import type { Category, Lead, LeadStatus, ProductWithCategory } from '@/lib/types'

const productSelect = '*, category:categories(id, name, slug)'

export function isDatabaseConfigured() {
  return getSupabaseEnv() !== null
}

// Публичные выборки: доступ ограничен RLS (только активные записи)
export async function getActiveCategories(): Promise<Category[]> {
  if (!isDatabaseConfigured()) return []
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .order('name')
  if (error) throw error
  return data as Category[]
}

export async function getActiveProducts(categorySlug?: string): Promise<ProductWithCategory[]> {
  if (!isDatabaseConfigured()) return []
  const supabase = createPublicClient()
  let query = supabase.from('products').select(productSelect).eq('is_active', true)
  if (categorySlug) {
    const { data: category } = await supabase.from('categories').select('id').eq('slug', categorySlug).maybeSingle()
    if (!category) return []
    query = query.eq('category_id', category.id)
  }
  const { data, error } = await query.order('sort_order').order('name')
  if (error) throw error
  return data as unknown as ProductWithCategory[]
}

export async function getActiveProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  if (!isDatabaseConfigured()) return null
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw error
  return data as unknown as ProductWithCategory | null
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isDatabaseConfigured()) return null
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw error
  return data as Category | null
}

// Для пересчёта цен заказа на сервере: товары, которых нет или которые не опубликованы, не попадают в заказ
export async function getPublishedProductsByIds(ids: string[]) {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, unit, slug')
    .in('id', ids)
    .eq('is_active', true)
  if (error) throw error
  return data
}

// Админка: выборки под авторизованным пользователем (RLS пускает только админов)
export async function getAdminCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
    .order('name')
  if (error) throw error
  return data as Category[]
}

export async function getAdminProducts(): Promise<ProductWithCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .order('is_active', { ascending: false })
    .order('sort_order')
    .order('name')
  if (error) throw error
  return data as unknown as ProductWithCategory[]
}

export async function getAdminProduct(id: string): Promise<ProductWithCategory | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('products').select(productSelect).eq('id', id).maybeSingle()
  if (error) throw error
  return data as unknown as ProductWithCategory | null
}

export async function getLeads(status?: LeadStatus | 'all'): Promise<Lead[]> {
  const supabase = await createClient()
  let query = supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(300)
  if (status && status !== 'all') query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data as Lead[]
}

export async function getLead(id: string): Promise<Lead | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('leads').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as Lead | null
}

export async function getCurrentAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle()
  return data ? user : null
}
