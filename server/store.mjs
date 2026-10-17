import { buildBulkRows } from './bulk.mjs'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { stockInput } from './inventory.mjs'

const fileQueues = new Map()

const SLUG = /^[a-z0-9-]{1,120}$/

export function slugify(value) {
  const map = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
    х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  }
  let out = ''
  for (const char of String(value).trim().toLowerCase()) {
    if (map[char] !== undefined) out += map[char]
    else if (/[a-z0-9]/.test(char)) out += char
    else out += '-'
  }
  return out.replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}

function cleanText(value, max) {
  const text = String(value ?? '').trim()
  if (!text) return null
  if (text.length > max) throw new Error(`Текст длиннее ${max} символов`)
  return text
}

function requiredText(value, max, label) {
  const text = cleanText(value, max)
  if (!text) throw new Error(`Укажите ${label}`)
  return text
}

function parsePrice(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(String(value).replace(',', '.').replace(/\s/g, ''))
  if (!Number.isFinite(number) || number < 0 || number > 9999999999) throw new Error('Некорректная цена')
  return Math.round(number * 100) / 100
}

function parseBool(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback
  return value === true || value === 'true' || value === 'on' || value === 1
}

function parseSort(value) {
  const number = Number(value ?? 0)
  if (!Number.isInteger(number) || number < -10000 || number > 10000) throw new Error('Порядок: целое число')
  return number
}

export function categoryInput(body, fallbackSlug) {
  const name = requiredText(body.name, 200, 'название раздела')
  const slug = slugify(body.slug || fallbackSlug || name)
  if (!SLUG.test(slug) || slug.length > 80) throw new Error('Адрес раздела: латиница, цифры и дефис')
  return {
    slug,
    name,
    description: cleanText(body.description, 2000),
    sort_order: parseSort(body.sort_order),
    is_active: parseBool(body.is_active, true),
  }
}

export function productInput(body, fallbackSlug) {
  const name = requiredText(body.name, 300, 'название товара')
  const slug = slugify(body.slug || fallbackSlug || name)
  if (!SLUG.test(slug)) throw new Error('Адрес товара: латиница, цифры и дефис')
  const unit = cleanText(body.unit, 30) || 'шт'
  const input = {
    slug,
    name,
    sku: cleanText(body.sku, 80),
    description: cleanText(body.description, 10000),
    price: parsePrice(body.price),
    unit,
    in_stock: parseBool(body.in_stock, true),
    sort_order: parseSort(body.sort_order),
    is_active: parseBool(body.is_active, true),
  }
  if (Object.hasOwn(body, 'category_id')) input.category_id = body.category_id || null
  if (Object.hasOwn(body, 'image_url')) input.image_url = cleanImageUrl(body.image_url)
  return input
}

function localAsset(text) {
  if (text.includes('..') || text.includes('\\') || text.includes('//') || text.includes('?') || text.includes('#')) return false
  if (!/^\/[a-zA-Z0-9._/-]+$/.test(text)) return false
  return text.startsWith('/uploads/') || text.startsWith('/assets/') || text.startsWith('/_static.tildacdn.com/')
}

function cleanImageUrl(value) {
  if (value === null || value === undefined || value === '') return null
  const text = String(value).trim()
  if (text.length > 2000) throw new Error('Некорректный адрес фото')
  if (localAsset(text)) return text
  let url
  try {
    url = new URL(text)
  } catch {
    throw new Error('Некорректный адрес фото')
  }
  if (url.protocol !== 'https:' || !url.pathname.startsWith('/storage/v1/object/public/product-images/')) {
    throw new Error('Некорректный адрес фото')
  }
  return text
}

function publicCatalog(categories, products) {
  const activeCategories = categories
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, 'ru'))
  const allowed = new Set(activeCategories.map((item) => item.id))
  const activeProducts = products
    .filter((item) => item.is_active && (!item.category_id || allowed.has(item.category_id)))
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, 'ru'))
  return { categories: activeCategories, products: activeProducts }
}

export function createFileStore(file) {


  async function read() {
    try {
      return JSON.parse(await readFile(file, 'utf8'))
    } catch (err) {
      if (err.code === 'ENOENT') return { categories: [], products: [] }
      throw err
    }
  }

  function update(mutator) {
    const run = (fileQueues.get(file) || Promise.resolve()).then(async () => {
      const data = await read()
      data.categories ??= []
      data.products ??= []
      const result = await mutator(data)
      await mkdir(path.dirname(file), { recursive: true })
      const tmp = `${file}.tmp`
      await writeFile(tmp, JSON.stringify(data, null, 2))
      await rename(tmp, file)
      return result
    })
    fileQueues.set(file, run.then(() => undefined, () => undefined))
    return run
  }

  return {
    mode: 'file',
    bulkProducts(updates) {
      return update(data => {
        const rows = buildBulkRows(updates, data.products, data.categories)
        for (const row of rows) Object.assign(data.products.find(p => p.id === row.id), row, { updated_at: new Date().toISOString() })
        return { updated: rows.length }
      })
    },
    async stockMovements() {
      const data = await read()
      return (data.stock_movements || []).slice().reverse().slice(0, 200)
    },
    adjustStock(id, body) {
      const input = stockInput(body)
      return update((data) => {
        const product = data.products.find((row) => row.id === id)
        if (!product) throw new Error('Товар не найден')
        const balance = (product.stock_quantity ?? 0) + input.delta
        if (balance < 0 || balance > 1000000000) throw new Error('Некорректный остаток: недостаточно товара или превышен лимит')
        product.stock_quantity = balance
        product.in_stock = balance > 0
        product.updated_at = new Date().toISOString()
        const movement = { id: randomUUID(), product_id: id, product_name: product.name, ...input, balance, created_at: product.updated_at }
        data.stock_movements ??= []
        data.stock_movements.push(movement)
        return movement
      })
    },
    async catalog() {
      const data = await read()
      return publicCatalog(data.categories, data.products)
    },
    async adminList() {
      const data = await read()
      return { categories: data.categories, products: data.products }
    },
    saveCategory(body, id) {
      return update((data) => {
        const current = id ? data.categories.find((item) => item.id === id) : null
        if (id && !current) throw new Error('Раздел не найден')
        const input = categoryInput(body, current?.slug)
        if (data.categories.some((item) => item.slug === input.slug && item.id !== id)) {
          throw new Error('Такой адрес раздела уже есть')
        }
        const now = new Date().toISOString()
        const row = {
          id: current?.id || randomUUID(),
          ...input,
          created_at: current?.created_at || now,
          updated_at: now,
        }
        if (current) Object.assign(current, row)
        else data.categories.push(row)
        return row
      })
    },
    deleteCategory(id) {
      return update((data) => {
        const before = data.categories.length
        data.categories = data.categories.filter((item) => item.id !== id)
        if (data.categories.length === before) throw new Error('Раздел не найден')
        for (const product of data.products) {
          if (product.category_id === id) product.category_id = null
        }
        return { ok: true }
      })
    },
    saveProduct(body, id) {
      return update((data) => {
        const current = id ? data.products.find((item) => item.id === id) : null
        if (id && !current) throw new Error('Товар не найден')
        const input = productInput(body, current?.slug)
        if (current?.stock_quantity != null) input.in_stock = current.stock_quantity > 0
        if (input.category_id && !data.categories.some((item) => item.id === input.category_id)) {
          throw new Error('Раздел не найден')
        }
        if (data.products.some((item) => item.slug === input.slug && item.id !== id)) {
          throw new Error('Такой адрес товара уже есть')
        }
        const now = new Date().toISOString()
        const row = {
          id: current?.id || randomUUID(),
          category_id: current?.category_id || null,
          image_url: current?.image_url || null,
          ...input,
          created_at: current?.created_at || now,
          updated_at: now,
        }
        if (current) Object.assign(current, row)
        else data.products.push(row)
        return row
      })
    },
    deleteProduct(id) {
      return update((data) => {
        const before = data.products.length
        data.products = data.products.filter((item) => item.id !== id)
        if (data.products.length === before) throw new Error('Товар не найден')
        return { ok: true }
      })
    },
  }
}

export function createSupabaseStore(client) {
  function raise(error) {
    if (!error) return
    if (/relation .* does not exist|schema cache/i.test(error.message)) {
      throw new Error('В Supabase нет таблиц каталога. Примените миграции из supabase/migrations.')
    }
    if (/duplicate key|unique/i.test(error.message)) throw new Error('Такой адрес уже есть')
    if (/row-level security|permission denied|42501/i.test(error.message)) throw new Error('Нет доступа')
    if (/недостаточно|остаток|товар не найден|некоррект/i.test(error.message)) throw new Error(error.message)
    if (/jwt|invalid claim|PGRST301/i.test(error.message)) throw new Error('Нужен вход')
    throw new Error('Не удалось сохранить данные')
  }

  return {
    mode: 'supabase',
    async bulkProducts(updates) {
      const all = await this.adminList()
      const rows = buildBulkRows(updates, all.products, all.categories)
      const result = await client.rpc('bulk_update_products', { p_rows: rows })
      raise(result.error)
      return { updated: rows.length }
    },
    async stockMovements() {
      const result = await client.from('stock_movements').select('*').order('created_at', { ascending: false }).limit(200)
      raise(result.error)
      return result.data || []
    },
    async adjustStock(id, body) {
      const input = stockInput(body)
      const result = await client.rpc('adjust_stock', { p_product_id: id, p_delta: input.delta, p_kind: input.kind, p_note: input.note })
      raise(result.error)
      return result.data
    },
    async catalog() {
      const categories = await client.from('categories').select('*').eq('is_active', true).order('sort_order')
      raise(categories.error)
      const products = await client.from('products').select('*').eq('is_active', true).order('sort_order')
      raise(products.error)
      return publicCatalog(categories.data || [], products.data || [])
    },
    async adminList() {
      const categories = await client.from('categories').select('*').order('sort_order')
      raise(categories.error)
      const products = await client.from('products').select('*').order('sort_order')
      raise(products.error)
      return { categories: categories.data || [], products: products.data || [] }
    },
    async saveCategory(body, id) {
      const current = id
        ? await client.from('categories').select('slug').eq('id', id).maybeSingle()
        : { data: null, error: null }
      raise(current.error)
      if (id && !current.data) throw new Error('Раздел не найден')
      const input = categoryInput(body, current.data?.slug)
      const query = id
        ? client.from('categories').update(input).eq('id', id).select('*').single()
        : client.from('categories').insert(input).select('*').single()
      const result = await query
      raise(result.error)
      return result.data
    },
    async deleteCategory(id) {
      const result = await client.from('categories').delete().eq('id', id).select('id')
      raise(result.error)
      if (!result.data?.length) throw new Error('Раздел не найден')
      return { ok: true }
    },
    async saveProduct(body, id) {
      const current = id
        ? await client.from('products').select('*').eq('id', id).maybeSingle()
        : { data: null, error: null }
      raise(current.error)
      if (id && !current.data) throw new Error('Товар не найден')
      const input = productInput(body, current.data?.slug)
      if (current.data?.stock_quantity != null) input.in_stock = current.data.stock_quantity > 0
      if (!id) {
        if (!Object.hasOwn(input, 'image_url')) input.image_url = null
        if (!Object.hasOwn(input, 'category_id')) input.category_id = null
      }
      const query = id
        ? client.from('products').update(input).eq('id', id).select('*').single()
        : client.from('products').insert(input).select('*').single()
      const result = await query
      raise(result.error)
      return result.data
    },
    async deleteProduct(id) {
      const result = await client.from('products').delete().eq('id', id).select('id')
      raise(result.error)
      if (!result.data?.length) throw new Error('Товар не найден')
      return { ok: true }
    },
  }
}
