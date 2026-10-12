import { z } from 'zod'
import { contactChannels } from '@/config/site'

export function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, '')
  if (digits.length === 11 && (digits.startsWith('8') || digits.startsWith('7'))) {
    digits = '7' + digits.slice(1)
  } else if (digits.length === 10) {
    digits = '7' + digits
  }
  if (digits.length < 11 || digits.length > 15) return null
  return '+' + digits
}

const channelValues = contactChannels.map((c) => c.value) as [string, ...string[]]

const phoneField = z
  .string()
  .trim()
  .max(30)
  .transform((v) => normalizePhone(v) ?? '')

const emailField = z
  .string()
  .trim()
  .max(254)
  .refine((v) => v === '' || z.email().safeParse(v).success, 'Укажите корректную почту')

const baseContact = {
  name: z.string().trim().min(2, 'Укажите имя').max(200),
  phone: z.string().trim().max(30).optional().default(''),
  email: emailField.optional().default(''),
  preferredContact: z.enum(channelValues as [string, ...string[]]),
  comment: z.string().trim().max(3000).optional().default(''),
  consent: z.literal(true, { error: 'Нужно согласие на обработку персональных данных' }),
  website: z.string().max(0).optional().default(''),
  sourcePage: z.string().max(300).optional().default(''),
}

function requireContact(
  data: { phone: string; email: string; preferredContact: string },
  ctx: z.RefinementCtx,
) {
  if (data.preferredContact === 'email') {
    if (!data.email) ctx.addIssue({ code: 'custom', path: ['email'], message: 'Укажите почту для связи' })
  } else {
    const phone = normalizePhone(data.phone)
    if (!phone) ctx.addIssue({ code: 'custom', path: ['phone'], message: 'Укажите телефон, например +7 999 000-00-00' })
  }
  if (!data.phone && !data.email) {
    ctx.addIssue({ code: 'custom', path: ['phone'], message: 'Укажите телефон или почту' })
  }
}

export const callbackSchema = z
  .object({
    ...baseContact,
    type: z.enum(['callback', 'contact']),
  })
  .superRefine(requireContact)
  .transform((d) => ({
    type: d.type,
    name: d.name,
    phone: normalizePhone(d.phone),
    email: d.email || null,
    preferredContact: d.preferredContact,
    comment: d.comment || null,
    sourcePage: d.sourcePage || null,
  }))

export const orderSchema = z
  .object({
    ...baseContact,
    deliveryMethod: z.enum(['pickup', 'delivery']),
    deliveryZone: z.enum(['city', 'oblast']).optional(),
    address: z.string().trim().max(500).optional().default(''),
    items: z
      .array(
        z.object({
          id: z.uuid(),
          qty: z.number().int().min(1).max(9999),
        }),
      )
      .min(1, 'Корзина пуста')
      .max(100),
  })
  .superRefine((d, ctx) => {
    requireContact(d, ctx)
    if (d.deliveryMethod === 'delivery') {
      if (!d.deliveryZone) {
        ctx.addIssue({ code: 'custom', path: ['deliveryZone'], message: 'Выберите зону доставки' })
      }
      if (d.address.length < 5) {
        ctx.addIssue({ code: 'custom', path: ['address'], message: 'Укажите адрес доставки' })
      }
    }
  })

export type OrderInput = z.input<typeof orderSchema>
export type CallbackInput = z.input<typeof callbackSchema>
