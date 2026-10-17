'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Brand } from '../../components/brand/Brand'
import { adminApi as api } from '../../components/admin/api'
import { Orders, Warehouse, type Order, type Movement } from '../../components/admin/Operations'
import { BulkProducts } from '../../components/admin/BulkProducts'
import { SiteSettingsEditor } from '../../components/admin/SiteSettingsEditor'
import { MailSettings } from '../../components/admin/MailSettings'
import { LiveOrders } from '../../components/admin/LiveOrders'
import { formatPrice } from '../../lib/format'

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
  slug: string
  id: string
  name: string
  category_id: string | null
  sku: string | null
  unit: string | null
  price: number | null
  sort_order: number
  description: string | null
  stock_quantity?: number | null
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
  const [currentRole, setCurrentRole] = useState('admin')
  const [loginError, setLoginError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategory)
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct)
  const [preview, setPreview] = useState('')
  const [fileKey, setFileKey] = useState(0)
  const [staff, setStaff] = useState<Array<{ id?: string; user_id?: string; email: string; name: string; role: string }>>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [movements, setMovements] = useState<Movement[]>([])
  const [tab, setTab] = useState('products')
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [notice, setNotice] = useState('')
  const [globalError, setGlobalError] = useState('')
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const tabs: Record<string, string> = { products: 'Товары', categories: 'Категории', orders: 'Заказы', stock: 'Складской учёт', staff: 'Администраторы', bulk: 'Массовый редактор', settings: 'Настройки сайта' }
  const [staffError, setStaffError] = useState('')

  function showApp(session: { mode?: string; role?: string }) {
    setCurrentRole(session.role || 'admin')
    setAuthed(true)
    setMode(session.mode === 'file' ? 'Локальный режим' : 'Supabase')
  }

  async function load() {
    const data = await api('/api/admin/catalog')
    setCategories(data.categories || [])
    setProducts(data.products || [])
    const results = await Promise.allSettled([
      api('/api/admin/staff'), api('/api/admin/orders'), api('/api/admin/inventory'),
    ])
    const errors: Record<string, string> = {}
    const keys = ['staff', 'orders', 'stock']
    results.forEach((result, index) => {
      if (result.status === 'rejected') errors[keys[index]] = result.reason?.message || 'Не удалось загрузить раздел'
    })
    setSectionErrors(errors)
    if (results[0].status === 'fulfilled') setStaff(results[0].value.staff || [])
    if (results[1].status === 'fulfilled') setOrders(results[1].value.orders || [])
    if (results[2].status === 'fulfilled') setMovements(results[2].value.movements || [])
  }

  useEffect(() => {
    let cancelled = false
    api('/api/admin/session')
      .then(async (session) => {
        if (cancelled) return
        setMode(session.mode === 'file' ? 'Локальный режим' : 'Supabase')
        if (!session.ok) return
        showApp(session)
        await load()
      })
      .catch(err => { setGlobalError(err.message || 'Не удалось загрузить панель.'); setLoginError(err.message || 'Не удалось загрузить панель.') })
    return () => {
      cancelled = true
    }
  }, [])

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setSaving(true)
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
    } finally { setSaving(false) }
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
      setSaving(true)
      await api(categoryForm.id ? `/api/admin/categories/${categoryForm.id}` : '/api/admin/categories', {
        method: categoryForm.id ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      setCategoryForm(emptyCategory())
      setNotice('Категория сохранена')
      await load()
    } catch (err) {
      setCategoryForm((form) => ({ ...form, error: err instanceof Error ? err.message : 'Ошибка запроса' }))
    } finally { setSaving(false) }
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
    const formElement = event.currentTarget
    try {
      setSaving(true)
      const file = (formElement.elements.namedItem('image') as HTMLInputElement | null)?.files?.[0]
      if (file) {
        body.image_type = file.type
        body.image_base64 = await fileToBase64(file)
      }
      await api(productForm.id ? `/api/admin/products/${productForm.id}` : '/api/admin/products', {
        method: productForm.id ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      setProductForm(emptyProduct())
      setNotice('Товар сохранён')
      setPreview('')
      setFileKey((value) => value + 1)
      await load()
    } catch (err) {
      setProductForm((form) => ({ ...form, error: err instanceof Error ? err.message : 'Ошибка запроса' }))
    } finally { setSaving(false) }
  }

  return (
    <main id="koruna-admin" className="admin">
      <section id="login" className="panel login" hidden={authed}>
        <Brand />
        <p className="eyebrow">Управление базой</p>
        <h1>Вход в панель</h1>
        <p className="lead">Каталог, заказы и склад — в одном месте.</p>
        <form id="login-form" onSubmit={onLogin}>
          <label>
            Почта
            <input type="email" name="email" autoComplete="username" required maxLength={200} />
          </label>
          <label>
            Пароль
            <input type="password" name="password" autoComplete="current-password" required maxLength={200} />
          </label>
          <button type="submit" disabled={saving}>{saving ? 'Входим…' : 'Войти в панель'}</button>
          <p id="login-error" className="error" hidden={!loginError}>{loginError}</p>
        </form>
        <p className="login-help">{mode === 'Supabase' ? 'Вход через Supabase Auth. Пользователь должен быть назначен администратором в admin_users. Локальная учётная запись здесь не действует.' : 'Локальный режим. Создать или восстановить администратора можно в терминале сервера: npm run admin:create. Универсального пароля нет.'}</p>
        <a className="back-link" href="/">← Вернуться на сайт</a>
      </section>

      <section id="app" className="app" hidden={!authed}>
        <aside className="admin-sidebar"><Brand /><p className="eyebrow">Панель управления</p><nav aria-label="Разделы панели">{Object.entries(tabs).map(([key, label]) => <button key={key} type="button" className={tab === key ? 'active' : ''} aria-current={tab === key ? 'page' : undefined} onClick={() => { setTab(key); setNotice(''); setGlobalError('') }}>{label}<span>{key === 'products' ? products.length : key === 'categories' ? categories.length : key === 'orders' ? orders.filter(o => o.status === 'new').length : ''}</span></button>)}</nav><a href="/">← Открыть сайт</a><small>Центральная<br />Строительная База</small></aside>
        <div className="admin-content">
        <header className="top">
          <div>
            <p className="eyebrow">Центральная Строительная База</p>
            <h1>{tabs[tab]}</h1>
          </div>
          <div className="top-actions">
            <span id="mode" className="mode">{mode}</span>
            <a href="/">На сайт</a>
            <button type="button" id="logout" onClick={onLogout}>Выйти</button>
          </div>
        </header>

        {authed && <LiveOrders onOrders={setOrders} />}
        <div className="stats"><div><span>Товары</span><strong>{products.length}</strong><small>В каталоге базы</small></div><div><span>Категории</span><strong>{categories.length}</strong><small>Направления поставок</small></div><div><span>Новые заказы</span><strong>{orders.filter(o => o.status === 'new').length}</strong><small>Ожидают обработки</small></div><div><span>Нет на складе</span><strong>{products.filter(p => p.stock_quantity === 0).length}</strong><small>Требуется пополнение</small></div></div>
        {notice && <p className="success" role="status">{notice}</p>}
        {globalError && <p className="error" role="alert">{globalError}</p>}
        {sectionErrors[tab] && <p className="error" role="alert">{sectionErrors[tab]}. Проверьте подключение и применение миграций Supabase.</p>}
        <div className="layout" hidden={!['categories', 'products'].includes(tab)}>
          <section className="panel editor-panel" hidden={tab !== 'categories'}>
            <h2>{categoryForm.id ? 'Редактирование категории' : 'Новая категория'}</h2>
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
                <button type="submit" disabled={saving}>{saving ? 'Сохраняем…' : 'Сохранить категорию'}</button>
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
                      try { await api(`/api/admin/categories/${category.id}`, { method: 'DELETE' }); await load(); setNotice('Запись удалена') }
                      catch (err) { setGlobalError(err instanceof Error ? err.message : 'Ошибка удаления') }
                    }}
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel editor-panel" hidden={tab !== 'products'}>
            <h2>{productForm.id ? 'Редактирование товара' : 'Новый товар'}</h2>
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
                <button type="submit" disabled={saving}>{saving ? 'Сохраняем…' : 'Сохранить товар'}</button>
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
            <div className="catalog-list"><div className="toolbar"><input aria-label="Поиск товаров" placeholder="Поиск по названию / артикулу" value={query} onChange={e => setQuery(e.target.value)} /><select aria-label="Фильтр категории" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option value="">Все категории</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><ul id="products" className="list">
              {products.filter(p => (!categoryFilter || p.category_id === categoryFilter) && `${p.name} ${p.sku || ''}`.toLowerCase().includes(query.toLowerCase())).map((product) => (
                <li key={product.id}>
                  <div className="product-thumb">{product.image_url && <img src={product.image_url} alt="" />}</div><span className="product-info"><strong>{product.name}</strong><small>{categories.find(c => c.id === product.category_id)?.name || 'Без категории'} · {product.sku || 'Без артикула'}</small><b>{formatPrice(product.price)} / {product.unit}</b><em className="badge">{product.is_active ? 'Опубликован' : 'Скрыт'} · {product.stock_quantity == null ? (product.in_stock ? 'В наличии' : 'Под заказ') : `${product.stock_quantity} ${product.unit} на складе`}</em></span>
                  <button type="button" onClick={() => fillProduct(product)}>Изменить</button>
                  <button
                    type="button"
                    className="ghost"
                    onClick={async () => {
                      if (!confirm(`Удалить товар «${product.name}»?`)) return
                      try { await api(`/api/admin/products/${product.id}`, { method: 'DELETE' }); await load(); setNotice('Запись удалена') }
                      catch (err) { setGlobalError(err instanceof Error ? err.message : 'Ошибка удаления') }
                    }}
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul></div>
          </section>
        </div>
        {tab === 'bulk' && <BulkProducts products={products} categories={categories} reload={load} />}
        {tab === 'settings' && <><MailSettings /><SiteSettingsEditor categories={categories} /></>}
        {tab === 'orders' && <Orders orders={orders} reload={load} />}
        {tab === 'stock' && <Warehouse products={products} movements={movements} reload={load} />}
        <div className="layout stack" hidden={tab !== 'staff'}>
          <section className="panel">
            <h2>Новый сотрудник</h2><p>Администратор управляет сайтом и добавляет администраторов. Только владелец может назначать владельцев и менять роли.</p>
            <form
              onSubmit={async (event) => {
                event.preventDefault()
                const form = event.currentTarget
                const data = new FormData(form)
                try {
                  const created = await api('/api/admin/staff', {
                    method: 'POST',
                    body: JSON.stringify({
                      name: data.get('name'),
                      email: data.get('email'),
                      password: data.get('password'),
                      role: data.get('role'),
                    }),
                  })
                  form.reset()
                  setStaffError('')
                  setNotice(created.emailConfirmationRequired ? 'Сотрудник создан. Перед входом нужно подтвердить его почту в Supabase.' : 'Сотрудник создан.')
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
                <input name="password" type="password" required minLength={12} maxLength={200} autoComplete="new-password" />
              </label>
              <label>Роль<select name="role" defaultValue="admin"><option value="admin">Администратор</option>{currentRole === 'owner' && <option value="owner">Владелец</option>}</select></label>
              <button type="submit">Назначить</button>
              <p className="error" hidden={!staffError}>{staffError}</p>
            </form>
            <ul className="list">
              {staff.map((person) => (
                <li key={person.id || person.user_id || person.email}>
                  <span>{person.name} · {person.email} · {person.role === 'owner' ? 'Владелец' : 'Администратор'}</span>
                  {currentRole === 'owner' && <button type="button" onClick={async()=>{
                    if (!confirm(`Изменить роль сотрудника ${person.email}?`)) return
                    try { await api('/api/admin/staff',{method:'PATCH',body:JSON.stringify({id:person.id || person.user_id,role:person.role === 'owner' ? 'admin' : 'owner'})}); const session=await api('/api/admin/session');setCurrentRole(session.role);await load();setStaffError('') } catch(err) {setStaffError(err instanceof Error ? err.message : 'Ошибка изменения роли')}
                  }}>{person.role === 'owner' ? 'Сделать администратором' : 'Сделать владельцем'}</button>}
                </li>
              ))}
            </ul>
          </section>

        </div>
        </div>
      </section>
    </main>
  )
}
