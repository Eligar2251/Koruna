'use server'

import { createClient } from '@/lib/supabase/server'
import { getPublishedProductsByIds } from '@/lib/data'
import { CONSENT_VERSION } from '@/lib/legal'
import { callbackSchema, normalizePhone, orderSchema, type CallbackInput, type OrderInput } from '@/lib/validation'
import type { LeadItem } from '@/lib/types'

export type SubmitResult = { ok: true } | { ok: false; error: string }

const genericError = 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.'

export async function submitOrder(input: OrderInput): Promise<SubmitResult> {
  if (input.website) return { ok: true }
  const parsed = orderSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Проверьте заполнение формы' }
  }
  const data = parsed.data

  try {
    const products = await getPublishedProductsByIds(data.items.map((i) => i.id))
    const byId = new Map(products.map((p) => [p.id, p]))

    const items: LeadItem[] = []
    for (const line of data.items) {
      const product = byId.get(line.id)
      if (!product) {
        return { ok: false, error: 'Некоторых товаров уже нет в продаже. Обновите корзину.' }
      }
      items.push({
        product_id: product.id,
        name: product.name,
        price: product.price === null ? null : Number(product.price),
        unit: product.unit,
        qty: line.qty,
      })
    }

    const hasUnpriced = items.some((i) => i.price === null)
    const total = hasUnpriced
      ? null
      : Math.round(items.reduce((sum, i) => sum + (i.price ?? 0) * i.qty, 0) * 100) / 100

    const address =
      data.deliveryMethod === 'delivery'
        ? `${data.deliveryZone === 'city' ? 'г. Новосибирск' : 'Новосибирская область'}, ${data.address}`
        : null

    const supabase = await createClient()
    const { error } = await supabase.from('leads').insert({
      type: 'order',
      name: data.name,
      phone: data.phone ? normalizePhone(data.phone) : null,
      email: data.email || null,
      preferred_contact: data.preferredContact,
      delivery_method: data.deliveryMethod,
      address,
      comment: data.comment || null,
      items,
      total,
      consent_pd: true,
      consent_version: CONSENT_VERSION,
      source_page: data.sourcePage || '/cart',
    })
    if (error) throw error
    return { ok: true }
  } catch (e) {
    console.error('submitOrder', e)
    return { ok: false, error: genericError }
  }
}

export async function submitRequest(input: CallbackInput): Promise<SubmitResult> {
  if (input.website) return { ok: true }
  const parsed = callbackSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Проверьте заполнение формы' }
  }
  const data = parsed.data

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('leads').insert({
      type: data.type,
      name: data.name,
      phone: data.phone,
      email: data.email,
      preferred_contact: data.preferredContact,
      comment: data.comment,
      consent_pd: true,
      consent_version: CONSENT_VERSION,
      source_page: data.sourcePage,
    })
    if (error) throw error
    return { ok: true }
  } catch (e) {
    console.error('submitRequest', e)
    return { ok: false, error: genericError }
  }
}
