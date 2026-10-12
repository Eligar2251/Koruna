export type Category = {
  id: string
  slug: string
  name: string
  description: string | null
  sort_order: number
  is_active: boolean
}

export type Product = {
  id: string
  category_id: string | null
  slug: string
  name: string
  sku: string | null
  description: string | null
  price: number | null
  unit: string
  in_stock: boolean
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ProductWithCategory = Product & { category: Pick<Category, 'id' | 'name' | 'slug'> | null }

export type LeadType = 'order' | 'callback' | 'contact'
export type LeadStatus = 'new' | 'in_progress' | 'done' | 'cancelled'

export type LeadItem = {
  product_id: string
  name: string
  price: number | null
  unit: string
  qty: number
}

export type Lead = {
  id: string
  type: LeadType
  status: LeadStatus
  name: string
  phone: string | null
  email: string | null
  preferred_contact: string
  delivery_method: 'pickup' | 'delivery' | null
  address: string | null
  comment: string | null
  items: LeadItem[]
  total: number | null
  consent_version: string
  consent_at: string
  source_page: string | null
  admin_note: string | null
  created_at: string
  updated_at: string
}

export type CartItem = {
  id: string
  slug: string
  name: string
  price: number | null
  unit: string
  qty: number
}
