'use client'

import { FormEvent, useEffect, useState } from 'react'

const PAGES: Array<[string, string]> = [
  ['', 'Свой адрес'],
  ['listovye-materialy', 'Листовые материалы'],
  ['osb-3', 'ОСП-3'],
  ['gipsokarton', 'Гипсокартон'],
  ['fanera', 'Фанера'],
  ['brusok', 'Брусок'],
  ['uteplitel', 'Утеплитель'],
  ['plitnyi', 'Утеплитель плитный'],
  ['rulonnyi', 'Утеплитель рулонный'],
  ['polikarbonat', 'Поликарбонат'],
  ['gidro-paroizolyaziya', 'Ветро- и пароизоляция'],
  ['profil-karkas', 'Профиль и каркас'],
  ['montajnaya-himiya', 'Монтажная химия'],
  ['krepej-i-metizy', 'Крепёж и метизы'],
  ['krovelnye-materialy', 'Кровельные материалы'],
]

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
}

type Product = {
  id: string
  name: string
  category_id: string | null
  sku: string | null
  unit: string | null
  price: number | null
  sort_order: number
  description: string | null
  in_stock: boolean
  is_active: boolean
  image_url: string | null
}

type CategoryForm = {
  id: string
  name: string
  slug: string
  page: string
  description: string
  sort_order: string
  is_active: boolean
  error: string
}

type ProductForm = {
  id: string
  name: string
  category_id: string
  sku: string
  unit: string
  price: string
  sort_order: string
  description: string
  in_stock: boolean
  is_active: boolean
  clear_image: boolean
  error: string
}

const emptyCategory = (): CategoryForm => ({
  id: '',
  name: '',
  slug: '',
  page: '',
  description: '',
  sort_order: '0',
  is_active: true,
  error: '',
})

const emptyProduct = (): ProductForm => ({
  id: '',
  name: '',
  category_id: '',
  sku: '',
  unit: 'шт',
  price: '',
  sort_order: '0',
  description: '',
  in_stock: true,
  is_active: true,
  clear_image: false,
  error: '',
})

async function api(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)
  headers.set('x-csb-request', '1')
  if (options.body && !headers.has('content-type')) headers.set('content-type', 'application/json')
  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Ошибка запроса')
  return data
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
    reader.onerror = () => reject(new Error('Не удалось прочитать фото'))
    reader.readAsDataURL(file)
  })
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [mode, setMode] = useState('')
  const [loginError, setLoginError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategory)
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct)
  const [preview, setPreview] = useState('')
  const [fileKey, setFileKey] = useState(0)
  const [staff, setStaff] = useState<Array<{ id?: string; user_id?: string; email: string; name: string }>>([])
  const [orders, setOrders] = useState<Array<{ id: string; customer_name: string; phone: string; total: number | null; created_at: string; items?: unknown[] }>>([])
  const [staffError, setStaffError] = useState('')

  function showApp(session: { mode?: string }) {
    setAuthed(true)
    setMode(session.mode === 'file' ? 'Файл' : 'Supabase')
  }

  async function load() {
    const data = await api('/api/admin/catalog')
    setCategories(data.categories || [])
    setProducts(data.products || [])
    const [staffResult, orderResult] = await Promise.allSettled([
      api('/api/admin/staff'),
      api('/api/admin/orders'),
    ])
    setStaff(staffResult.status === 'fulfilled' ? staffResult.value.staff || [] : [])
    setOrders(orderResult.status === 'fulfilled' ? orderResult.value.orders || [] : [])
  }

  useEffect(() => {
    let cancelled = false
    api('/api/admin/session')
      .then(async (session) => {
        if (cancelled || !session.ok) return
        showApp(session)
        await load()
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      await api('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      })
      showApp(await api('/api/admin/session'))
      await load()
      setLoginError('')
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Ошибка запроса')
    }
  }

  async function onLogout() {
    await api('/api/admin/logout', { method: 'POST' })
    location.reload()
  }

  function fillCategory(category: Category) {
    setCategoryForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
      page: PAGES.some(([slug]) => slug === category.slug) ? category.slug : '',
      description: category.description || '',
      sort_order: String(category.sort_order),
      is_active: category.is_active,
      error: '',
    })
  }

  function fillProduct(product: Product) {
    setProductForm({
      id: product.id,
      name: product.name,
      category_id: product.category_id || '',
      sku: product.sku || '',
      unit: product.unit || 'шт',
      price: product.price === null || product.price === undefined ? '' : String(product.price),
      sort_order: String(product.sort_order),
      description: product.description || '',
      in_stock: product.in_stock,
      is_active: product.is_active,
      clear_image: false,
      error: '',
    })
    setPreview(product.image_url || '')
    setFileKey((value) => value + 1)
  }

  async function onCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = {
      name: categoryForm.name,
      slug: categoryForm.slug || categoryForm.page,
      description: categoryForm.description,
      sort_order: categoryForm.sort_order,
      is_active: categoryForm.is_active,
    }
    try {
      await api(categoryForm.id ? `/api/admin/categories/${categoryForm.id}` : '/api/admin/categories', {
        method: categoryForm.id ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      setCategoryForm(emptyCategory())
      await load()
    } catch (err) {
      setCategoryForm((form) => ({ ...form, error: err instanceof Error ? err.message : 'Ошибка запроса' }))
    }
  }

  async function onProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body: Record<string, unknown> = {
      name: productForm.name,
      category_id: productForm.category_id || null,
      sku: productForm.sku,
      unit: productForm.unit,
      price: productForm.price,
      sort_order: productForm.sort_order,
      description: productForm.description,
      in_stock: productForm.in_stock,
      is_active: productForm.is_active,
      clear_image: productForm.clear_image,
    }
    const file = (event.currentTarget.elements.namedItem('image') as HTMLInputElement | null)?.files?.[0]
    if (file) {
      body.image_type = file.type
      body.image_base64 = await fileToBase64(file)
    }
    try {
      await api(productForm.id ? `/api/admin/products/${productForm.id}` : '/api/admin/products', {
        method: productForm.id ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      setProductForm(emptyProduct())
      setPreview('')
      setFileKey((value) => value + 1)
      await load()
    } catch (err) {
      setProductForm((form) => ({ ...form, error: err instanceof Error ? err.message : 'Ошибка запроса' }))
    }
  }

  return (
    <main id="koruna-admin" className="admin">
      <section id="login" className="panel login" hidden={authed}>
        <p className="eyebrow">ЦСБ</p>
        <h1>Вход</h1>
        <form id="login-form" onSubmit={onLogin}>
          <label>
            Почта
            <input type="email" name="email" autoComplete="username" required maxLength={200} />
          </label>
          <label>
            Пароль
            <input type="password" name="password" autoComplete="current-password" required maxLength={200} />
          </label>
          <button type="submit">Войти</button>
          <p id="login-error" className="error" hidden={!loginError}>{loginError}</p>
        </form>
      </section>

      <section id="app" className="app" hidden={!authed}>
        <header className="top">
          <div>
            <p className="eyebrow">Админка</p>
            <h1>Каталог</h1>
          </div>
          <div className="top-actions">
            <span id="mode" className="mode">{mode}</span>
            <a href="/">На сайт</a>
            <button type="button" id="logout" onClick={onLogout}>Выйти</button>
          </div>
        </header>

        <div className="layout">
          <section className="panel">
            <h2>Раздел</h2>
            <form id="category-form" onSubmit={onCategory}>
              <input type="hidden" name="id" value={categoryForm.id} readOnly />
              <label>
                Название
                <input
                  name="name"
                  required
                  maxLength={200}
                  value={categoryForm.name}
                  onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })}
                />
              </label>
              <label>
                Страница сайта
                <select
                  name="page"
                  id="page-slug"
                  value={categoryForm.page}
                  onChange={(event) => {
                    const page = event.target.value
                    setCategoryForm({
                      ...categoryForm,
                      page,
                      slug: page || categoryForm.slug,
                    })
                  }}
                >
                  {PAGES.map(([slug, name]) => (
                    <option key={slug || 'custom'} value={slug}>{name}</option>
                  ))}
                </select>
              </label>
              <label>
                Адрес (slug)
                <input
                  name="slug"
                  maxLength={80}
                  pattern="[a-z0-9-]*"
                  placeholder="заполнится из названия"
                  value={categoryForm.slug}
                  onChange={(event) => setCategoryForm({ ...categoryForm, slug: event.target.value })}
                />
              </label>
              <label>
                Описание
                <textarea
                  name="description"
                  maxLength={2000}
                  rows={3}
                  value={categoryForm.description}
                  onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })}
                />
              </label>
              <label>
                Порядок
                <input
                  name="sort_order"
                  type="number"
                  value={categoryForm.sort_order}
                  onChange={(event) => setCategoryForm({ ...categoryForm, sort_order: event.target.value })}
                />
              </label>
              <label className="check">
                <input
                  name="is_active"
                  type="checkbox"
                  checked={categoryForm.is_active}
                  onChange={(event) => setCategoryForm({ ...categoryForm, is_active: event.target.checked })}
                />
                {' '}Показывать на сайте
              </label>
              <div className="row">
                <button type="submit">Сохранить раздел</button>
                <button type="button" id="category-reset" className="ghost" onClick={() => setCategoryForm(emptyCategory())}>Новый</button>
              </div>
              <p className="error" hidden={!categoryForm.error}>{categoryForm.error}</p>
            </form>
            <ul id="categories" className="list">
              {categories.map((category) => (
                <li key={category.id}>
                  <span>{`${category.name} · ${category.slug}${category.is_active ? '' : ' · скрыт'}`}</span>
                  <button type="button" onClick={() => fillCategory(category)}>Изменить</button>
                  <button
                    type="button"
                    className="ghost"
                    onClick={async () => {
                      if (!confirm(`Удалить раздел «${category.name}»?`)) return
                      await api(`/api/admin/categories/${category.id}`, { method: 'DELETE' })
                      await load()
                    }}
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <h2>Товар</h2>
            <form id="product-form" onSubmit={onProduct}>
              <input type="hidden" name="id" value={productForm.id} readOnly />
              <label>
                Название
                <input
                  name="name"
                  required
                  maxLength={300}
                  value={productForm.name}
                  onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
                />
              </label>
              <label>
                Раздел
                <select
                  name="category_id"
                  id="product-category"
                  value={productForm.category_id}
                  onChange={(event) => setProductForm({ ...productForm, category_id: event.target.value })}
                >
                  <option value="">Без раздела</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <div className="split">
                <label>
                  Артикул
                  <input
                    name="sku"
                    maxLength={80}
                    value={productForm.sku}
                    onChange={(event) => setProductForm({ ...productForm, sku: event.target.value })}
                  />
                </label>
                <label>
                  Единица
                  <input
                    name="unit"
                    value={productForm.unit}
                    maxLength={30}
                    required
                    onChange={(event) => setProductForm({ ...productForm, unit: event.target.value })}
                  />
                </label>
              </div>
              <div className="split">
                <label>
                  Цена, ₽
                  <input
                    name="price"
                    inputMode="decimal"
                    placeholder="пусто — по запросу"
                    value={productForm.price}
                    onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                  />
                </label>
                <label>
                  Порядок
                  <input
                    name="sort_order"
                    type="number"
                    value={productForm.sort_order}
                    onChange={(event) => setProductForm({ ...productForm, sort_order: event.target.value })}
                  />
                </label>
              </div>
              <label>
                Описание
                <textarea
                  name="description"
                  maxLength={10000}
                  rows={4}
                  value={productForm.description}
                  onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
                />
              </label>
              <label>
                Фото
                <input key={fileKey} name="image" type="file" accept="image/jpeg,image/png,image/webp" />
              </label>
              <img id="preview" alt="" hidden={!preview} src={preview || undefined} />
              <label className="check">
                <input
                  name="clear_image"
                  type="checkbox"
                  checked={productForm.clear_image}
                  onChange={(event) => setProductForm({ ...productForm, clear_image: event.target.checked })}
                />
                {' '}Убрать текущее фото
              </label>
              <label className="check">
                <input
                  name="in_stock"
                  type="checkbox"
                  checked={productForm.in_stock}
                  onChange={(event) => setProductForm({ ...productForm, in_stock: event.target.checked })}
                />
                {' '}В наличии
              </label>
              <label className="check">
                <input
                  name="is_active"
                  type="checkbox"
                  checked={productForm.is_active}
                  onChange={(event) => setProductForm({ ...productForm, is_active: event.target.checked })}
                />
                {' '}Опубликовать
              </label>
              <div className="row">
                <button type="submit">Сохранить товар</button>
                <button
                  type="button"
                  id="product-reset"
                  className="ghost"
                  onClick={() => {
                    setProductForm(emptyProduct())
                    setPreview('')
                    setFileKey((value) => value + 1)
                  }}
                >
                  Новый
                </button>
              </div>
              <p className="error" hidden={!productForm.error}>{productForm.error}</p>
            </form>
            <ul id="products" className="list">
              {products.map((product) => (
                <li key={product.id}>
                  <span>{`${product.name}${product.is_active ? '' : ' · скрыт'}`}</span>
                  <button type="button" onClick={() => fillProduct(product)}>Изменить</button>
                  <button
                    type="button"
                    className="ghost"
                    onClick={async () => {
                      if (!confirm(`Удалить товар «${product.name}»?`)) return
                      await api(`/api/admin/products/${product.id}`, { method: 'DELETE' })
                      await load()
                    }}
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="layout stack">
          <section className="panel">
            <h2>Новый администратор</h2>
            <form
              onSubmit={async (event) => {
                event.preventDefault()
                const form = event.currentTarget
                const data = new FormData(form)
                try {
                  await api('/api/admin/staff', {
                    method: 'POST',
                    body: JSON.stringify({
                      name: data.get('name'),
                      email: data.get('email'),
                      password: data.get('password'),
                    }),
                  })
                  form.reset()
                  setStaffError('')
                  await load()
                } catch (err) {
                  setStaffError(err instanceof Error ? err.message : 'Ошибка запроса')
                }
              }}
            >
              <label>
                Имя
                <input name="name" required maxLength={120} />
              </label>
              <label>
                Почта
                <input name="email" type="email" required maxLength={200} autoComplete="off" />
              </label>
              <label>
                Пароль
                <input name="password" type="password" required minLength={8} maxLength={200} autoComplete="new-password" />
              </label>
              <button type="submit">Назначить</button>
              <p className="error" hidden={!staffError}>{staffError}</p>
            </form>
            <ul className="list">
              {staff.map((person) => (
                <li key={person.id || person.user_id || person.email}>
                  <span>{person.name} · {person.email}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <h2>Заказы</h2>
            <ul className="list">
              {orders.map((order) => (
                <li key={order.id}>
                  <span>{order.customer_name} · {order.phone} · {order.total ?? 'по запросу'} · {new Date(order.created_at).toLocaleString('ru-RU')}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </main>
  )
}
