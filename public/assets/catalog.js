document.addEventListener('submit', (event) => {
  if (event.target?.closest?.('#koruna-admin')) return
  event.preventDefault()
}, true)

const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 })

function priceText(product) {
  if (product.price === null || product.price === undefined || product.price === '') return 'Цена по запросу'
  return `${money.format(Number(product.price))} / ${product.unit || 'шт'}`
}

function card(product) {
  const article = document.createElement('article')
  article.className = 'koruna-card'
  const media = document.createElement('div')
  media.className = 'koruna-card__media'
  if (product.image_url) {
    const image = document.createElement('img')
    image.src = product.image_url
    image.alt = product.name
    media.append(image)
  }
  const body = document.createElement('div')
  body.className = 'koruna-card__body'
  const title = document.createElement('h3')
  title.textContent = product.name
  const price = document.createElement('p')
  price.className = 'koruna-card__price'
  price.textContent = priceText(product)
  const meta = document.createElement('p')
  meta.className = 'koruna-card__meta'
  const bits = []
  if (product.sku) bits.push(`Артикул ${product.sku}`)
  bits.push(product.in_stock ? 'В наличии' : 'Под заказ')
  meta.textContent = bits.join(' · ')
  body.append(title, price, meta)
  if (product.description) {
    const text = document.createElement('p')
    text.className = 'koruna-card__text'
    text.hidden = true
    text.textContent = product.description
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'koruna-card__more'
    button.textContent = 'Описание'
    button.addEventListener('click', () => {
      text.hidden = !text.hidden
      button.textContent = text.hidden ? 'Описание' : 'Скрыть'
    })
    body.append(text, button)
  }
  article.append(media, body)
  return article
}

function render(root, payload) {
  const mode = root.dataset.mode || 'all'
  const slug = root.dataset.slug || ''
  const categories = payload.categories || []
  const category = categories.find((item) => item.slug === slug)
  let products = payload.products || []
  if (mode === 'category') {
    products = category ? products.filter((item) => item.category_id === category.id) : []
  }
  const section = root.closest('.koruna-rec')
  if (mode === 'home' && !products.length && !categories.length) {
    section?.remove()
    return
  }
  if (section) section.style.display = 'block'

  root.replaceChildren()
  const head = document.createElement('div')
  head.className = 'koruna-catalog__head'
  const titles = document.createElement('div')
  const heading = document.createElement('h2')
  heading.textContent = category?.name || (mode === 'home' ? 'Каталог' : 'Товары')
  titles.append(heading)
  if (category?.description) {
    const note = document.createElement('p')
    note.textContent = category.description
    titles.append(note)
  }
  const admin = document.createElement('a')
  admin.className = 'koruna-catalog__admin'
  admin.href = '/admin'
  admin.textContent = 'Добавить товар'
  head.append(titles, admin)
  root.append(head)

  if (mode !== 'category' && categories.length) {
    const chips = document.createElement('div')
    chips.className = 'koruna-chips'
    for (const item of categories) {
      const chip = document.createElement('span')
      chip.textContent = item.name
      chips.append(chip)
    }
    root.append(chips)
  }

  if (!products.length) {
    const empty = document.createElement('p')
    empty.className = 'koruna-catalog__state'
    empty.textContent = 'В этом разделе пока нет товаров. Их можно добавить в админке.'
    root.append(empty)
    return
  }

  const grid = document.createElement('div')
  grid.className = 'koruna-grid'
  for (const product of products.slice(0, mode === 'home' ? 8 : products.length)) grid.append(card(product))
  root.append(grid)
}

async function start() {
  const roots = [...document.querySelectorAll('#koruna-catalog')]
  if (!roots.length) return
  try {
    const response = await fetch('/api/catalog')
    if (!response.ok) throw new Error('catalog')
    const payload = await response.json()
    for (const root of roots) render(root, payload)
  } catch {
    for (const root of roots) {
      root.textContent = 'Не удалось загрузить товары.'
    }
  }
}

start()
