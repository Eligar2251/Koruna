import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

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
  if (Object.hasOwn(body, 'image_url')) input.image_url = body.image_url || null
  return input
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
  let queue = Promise.resolve()

  async function read() {
    try {
      return JSON.parse(await readFile(file, 'utf8'))
    } catch (err) {
      if (err.code === 'ENOENT') return { categories: [], products: [] }
      throw err
    }
  }

  function update(mutator) {
    const run = queue.then(async () => {
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
    queue = run.then(() => undefined, () => undefined)
    return run
  }

  return {
    mode: 'file',
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
    if (/duplicate key/i.test(error.message)) throw new Error('Такой адрес уже есть')
    throw new Error(error.message)
  }

  return {
    mode: 'supabase',
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
        ? await client.from('products').select('slug,image_url').eq('id', id).maybeSingle()
        : { data: null, error: null }
      raise(current.error)
      if (id && !current.data) throw new Error('Товар не найден')
      const input = productInput(body, current.data?.slug)
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
