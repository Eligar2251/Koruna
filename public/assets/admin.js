const PAGES = [
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

const login = document.querySelector('#login')
const app = document.querySelector('#app')
const pageSlug = document.querySelector('#page-slug')
const categoryForm = document.querySelector('#category-form')
const productForm = document.querySelector('#product-form')
const categoryList = document.querySelector('#categories')
const productList = document.querySelector('#products')
const productCategory = document.querySelector('#product-category')
const preview = document.querySelector('#preview')

for (const [slug, name] of PAGES) {
  const option = document.createElement('option')
  option.value = slug
  option.textContent = name
  pageSlug.append(option)
}

function errorBox(form, message) {
  const box = form.querySelector('.error')
  box.hidden = !message
  box.textContent = message || ''
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: options.body ? { 'content-type': 'application/json' } : undefined,
    ...options,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Ошибка запроса')
  return data
}

function showApp(session) {
  login.hidden = true
  app.hidden = false
  document.querySelector('#mode').textContent = session.mode === 'supabase'
    ? 'Запись в Supabase'
    : 'Локальный предпросмотр, Supabase не подключён'
}

async function load() {
  const data = await api('/api/admin/catalog')
  categoryList.replaceChildren()
  productCategory.replaceChildren()
  const empty = document.createElement('option')
  empty.value = ''
  empty.textContent = 'Без раздела'
  productCategory.append(empty)
  for (const category of data.categories) {
    const item = document.createElement('li')
    const name = document.createElement('span')
    name.textContent = `${category.name} · ${category.slug}${category.is_active ? '' : ' · скрыт'}`
    const edit = document.createElement('button')
    edit.type = 'button'
    edit.textContent = 'Изменить'
    edit.addEventListener('click', () => fillCategory(category))
    const remove = document.createElement('button')
    remove.type = 'button'
    remove.className = 'ghost'
    remove.textContent = 'Удалить'
    remove.addEventListener('click', async () => {
      if (!confirm(`Удалить раздел «${category.name}»?`)) return
      await api(`/api/admin/categories/${category.id}`, { method: 'DELETE' })
      await load()
    })
    item.append(name, edit, remove)
    categoryList.append(item)
    const option = document.createElement('option')
    option.value = category.id
    option.textContent = category.name
    productCategory.append(option)
  }

  productList.replaceChildren()
  for (const product of data.products) {
    const item = document.createElement('li')
    const name = document.createElement('span')
    name.textContent = `${product.name}${product.is_active ? '' : ' · скрыт'}`
    const edit = document.createElement('button')
    edit.type = 'button'
    edit.textContent = 'Изменить'
    edit.addEventListener('click', () => fillProduct(product))
    const remove = document.createElement('button')
    remove.type = 'button'
    remove.className = 'ghost'
    remove.textContent = 'Удалить'
    remove.addEventListener('click', async () => {
      if (!confirm(`Удалить товар «${product.name}»?`)) return
      await api(`/api/admin/products/${product.id}`, { method: 'DELETE' })
      await load()
    })
    item.append(name, edit, remove)
    productList.append(item)
  }
}

function fillCategory(category) {
  categoryForm.elements.id.value = category.id
  categoryForm.elements.name.value = category.name
  categoryForm.elements.slug.value = category.slug
  categoryForm.elements.description.value = category.description || ''
  categoryForm.elements.sort_order.value = category.sort_order
  categoryForm.elements.is_active.checked = category.is_active
  pageSlug.value = [...pageSlug.options].some((option) => option.value === category.slug) ? category.slug : ''
}

function fillProduct(product) {
  productForm.elements.id.value = product.id
  productForm.elements.name.value = product.name
  productForm.elements.category_id.value = product.category_id || ''
  productForm.elements.sku.value = product.sku || ''
  productForm.elements.unit.value = product.unit || 'шт'
  productForm.elements.price.value = product.price ?? ''
  productForm.elements.sort_order.value = product.sort_order
  productForm.elements.description.value = product.description || ''
  productForm.elements.in_stock.checked = product.in_stock
  productForm.elements.is_active.checked = product.is_active
  productForm.elements.clear_image.checked = false
  preview.hidden = !product.image_url
  preview.src = product.image_url || ''
}

document.querySelector('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  const box = document.querySelector('#login-error')
  try {
    await api('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password: event.target.password.value }),
    })
    showApp(await api('/api/admin/session'))
    await load()
  } catch (err) {
    box.hidden = false
    box.textContent = err.message
  }
})

document.querySelector('#logout').addEventListener('click', async () => {
  await api('/api/admin/logout', { method: 'POST' })
  location.reload()
})

pageSlug.addEventListener('change', () => {
  if (pageSlug.value) categoryForm.elements.slug.value = pageSlug.value
})

document.querySelector('#category-reset').addEventListener('click', () => categoryForm.reset())
document.querySelector('#product-reset').addEventListener('click', () => {
  productForm.reset()
  preview.hidden = true
})

categoryForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const form = event.target
  const body = {
    name: form.name.value,
    slug: form.slug.value || pageSlug.value,
    description: form.description.value,
    sort_order: form.sort_order.value,
    is_active: form.is_active.checked,
  }
  try {
    const id = form.id.value
    await api(id ? `/api/admin/categories/${id}` : '/api/admin/categories', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(body),
    })
    form.reset()
    errorBox(form, '')
    await load()
  } catch (err) {
    errorBox(form, err.message)
  }
})

productForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const form = event.target
  const body = {
    name: form.name.value,
    category_id: form.category_id.value || null,
    sku: form.sku.value,
    unit: form.unit.value,
    price: form.price.value,
    sort_order: form.sort_order.value,
    description: form.description.value,
    in_stock: form.in_stock.checked,
    is_active: form.is_active.checked,
    clear_image: form.clear_image.checked,
  }
  const file = form.image.files[0]
  if (file) {
    body.image_type = file.type
    body.image_base64 = await fileToBase64(file)
  }
  try {
    const id = form.id.value
    await api(id ? `/api/admin/products/${id}` : '/api/admin/products', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(body),
    })
    form.reset()
    preview.hidden = true
    errorBox(form, '')
    await load()
  } catch (err) {
    errorBox(form, err.message)
  }
})

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
    reader.onerror = () => reject(new Error('Не удалось прочитать фото'))
    reader.readAsDataURL(file)
  })
}

const session = await api('/api/admin/session')
if (session.ok) {
  showApp(session)
  await load()
}
