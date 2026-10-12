'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const statuses = ['new', 'in_progress', 'done', 'cancelled'] as const

export async function updateLead(formData: FormData) {
  const parsed = z
    .object({
      id: z.uuid(),
      status: z.enum(statuses),
      adminNote: z.string().trim().max(3000),
    })
    .safeParse({
      id: String(formData.get('id') ?? ''),
      status: String(formData.get('status') ?? ''),
      adminNote: String(formData.get('adminNote') ?? ''),
    })
  if (!parsed.success) throw new Error('Некорректные данные заявки')

  const supabase = await createClient()
  const { error } = await supabase
    .from('leads')
    .update({ status: parsed.data.status, admin_note: parsed.data.adminNote || null })
    .eq('id', parsed.data.id)
  if (error) throw error

  revalidatePath(`/admin/leads/${parsed.data.id}`)
  revalidatePath('/admin/leads')
}
