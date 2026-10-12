'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'

export type ProductFormState = { error?: string }

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const schema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1, 'Укажите название').max(300),
  slug: z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-z0-9-]*$/, 'Адрес: только латиница, цифры и дефис'),
  sku: z.string().trim().max(80),
  categoryId: z.uuid().or(z.literal('')),
  description: z.string().trim().max(10000),
  price: z.string().trim(),
  unit: z.string().trim().min(1, 'Укажите единицу измерения').max(30),
  inStock: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(-10000).max(10000),
  imageUrl: z.string().trim().max(2000),
})

function parsePrice(raw: string): number | null | undefined {
  if (raw === '') return null
  const n = Number(raw.replace(',', '.').replace(/\s/g, ''))
  if (!Number.isFinite(n) || n < 0) return undefined
  return Math.round(n * 100) / 100
}

async function uploadImage(file: File): Promise<string | ProductFormState> {
  const ext = IMAGE_TYPES[file.type]
  if (!ext) return { error: 'Фото: допустимы JPG, PNG или WebP' }
  if (file.size > MAX_IMAGE_BYTES) return { error: 'Фото не больше 5 МБ' }

  const supabase = await createClient()
  const path = `products/${randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('product-images').upload(path, file, {
    contentType: file.type,
    cacheControl: '3600',
  })
  if (error) {
    console.error('upload', error)
    return { error: 'Не удалось загрузить фото' }
  }
  return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
}

export async function saveProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const raw = {
    id: String(formData.get('id') ?? '') || undefined,
    name: String(formData.get('name') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    sku: String(formData.get('sku') ?? ''),
    categoryId: String(formData.get('categoryId') ?? ''),
    description: String(formData.get('description') ?? ''),
    price: String(formData.get('price') ?? ''),
    unit: String(formData.get('unit') ?? ''),
    inStock: formData.get('inStock') === 'on',
    isActive: formData.get('isActive') === 'on',
    sortOrder: String(formData.get('sortOrder') ?? '0') || '0',
    imageUrl: String(formData.get('imageUrl') ?? ''),
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Проверьте поля' }
  const data = parsed.data

  const price = parsePrice(data.price)
  if (price === undefined) return { error: 'Цена: укажите число или оставьте пустым' }

  let imageUrl: string | null = data.imageUrl || null
  const file = formData.get('image')
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadImage(file)
    if (typeof uploaded !== 'string') return uploaded
    imageUrl = uploaded
  }

  const slug = data.slug || slugify(data.name)
  if (!slug) return { error: 'Укажите адрес товара (латиницей)' }

  const row = {
    name: data.name,
    slug,
    sku: data.sku || null,
    category_id: data.categoryId || null,
    description: data.description || null,
    price,
    unit: data.unit,
    in_stock: data.inStock,
    is_active: data.isActive,
    sort_order: data.sortOrder,
    image_url: imageUrl,
  }

  const supabase = await createClient()
  const query = data.id
    ? supabase.from('products').update(row).eq('id', data.id)
    : supabase.from('products').insert(row)
  const { error } = await query
  if (error) {
    if (error.code === '23505') return { error: 'Товар с таким адресом (slug) уже есть' }
    console.error('saveProduct', error)
    return { error: 'Не удалось сохранить товар' }
  }

  revalidatePath('/catalog', 'layout')
  revalidatePath('/')
  redirect('/admin/products?saved=1')
}

export async function deleteProduct(formData: FormData) {
  const id = z.uuid().parse(String(formData.get('id') ?? ''))
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/catalog', 'layout')
  revalidatePath('/')
  redirect('/admin/products')
}
