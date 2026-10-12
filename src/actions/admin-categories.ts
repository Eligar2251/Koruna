'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'

export type CategoryFormState = { error?: string; ok?: boolean }

const schema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1, 'Укажите название').max(200),
  slug: z.string().trim().max(80).regex(/^[a-z0-9-]*$/, 'Адрес: только латиница, цифры и дефис'),
  description: z.string().trim().max(2000),
  sortOrder: z.coerce.number().int().min(-10000).max(10000),
  isActive: z.boolean(),
})

export async function saveCategory(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const parsed = schema.safeParse({
    id: String(formData.get('id') ?? '') || undefined,
    name: String(formData.get('name') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    description: String(formData.get('description') ?? ''),
    sortOrder: String(formData.get('sortOrder') ?? '0') || '0',
    isActive: formData.get('isActive') === 'on',
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Проверьте поля' }
  const data = parsed.data

  const slug = data.slug || slugify(data.name)
  if (!slug) return { error: 'Укажите адрес раздела (латиницей)' }

  const row = {
    name: data.name,
    slug,
    description: data.description || null,
    sort_order: data.sortOrder,
    is_active: data.isActive,
  }

  const supabase = await createClient()
  const query = data.id
    ? supabase.from('categories').update(row).eq('id', data.id)
    : supabase.from('categories').insert(row)
  const { error } = await query
  if (error) {
    if (error.code === '23505') return { error: 'Раздел с таким адресом уже есть' }
    console.error('saveCategory', error)
    return { error: 'Не удалось сохранить раздел' }
  }

  revalidatePath('/catalog', 'layout')
  revalidatePath('/')
  return { ok: true }
}
