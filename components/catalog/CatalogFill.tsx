import { categoryHref, categoryImage, productsIn, type CatalogCategory, type CatalogProduct } from '../../lib/catalog'
import { formatPrice } from '../../lib/format'
import { getStore } from '../../lib/server'
import { AddButton, Description } from './AddButton'
import './design/catalog.css'

function priceLine(product: CatalogProduct) {
  if (product.price === null || product.price === undefined) return 'Цена по запросу'
  return `${formatPrice(product.price)} / ${product.unit || 'шт'}`
}

export async function CatalogFill({ mode, slug }: { mode: string; slug: string }) {
  if (mode === 'home') return null
  try {
    const store = await getStore()
    const data = await store.catalog()
    const categories = (data.categories || []) as CatalogCategory[]
    const products = (data.products || []) as CatalogProduct[]
    const current = categories.find((item) => item.slug === slug)
    const visible = mode === 'category' ? productsIn(products, categories, slug || current?.slug || '') : products
    const title = current?.name || 'Товары'
    return (
      <div className="koruna-catalog" data-mode={mode} data-slug={slug}>
        <div className="koruna-catalog__head">
          <div>
            <h2>{title}</h2>
            {current?.description ? <p>{current.description}</p> : null}
          </div>
        </div>
        {mode !== 'category' && categories.length ? (
          <div className="koruna-grid">
            {categories.map((item) => {
              const image = categoryImage(item.slug)
              return (
                <a className="koruna-card" href={categoryHref(item.slug)} key={item.id}>
                  <div className="koruna-card__media">{image ? <img src={image} alt="" /> : null}</div>
                  <div className="koruna-card__body">
                    <h3>{item.name}</h3>
                  </div>
                </a>
              )
            })}
          </div>
        ) : null}
        {visible.length ? (
          <div className="koruna-grid">
            {visible.map((product) => (
              <article className="koruna-card koruna-card--product" key={product.id}>
                <div className="koruna-card__media">
                  {product.image_url ? <img src={product.image_url} alt="" /> : null}
                </div>
                <div className="koruna-card__body">
                  <h3 title={product.name}>{product.name}</h3>
                  <p className="koruna-card__price">{priceLine(product)}</p>
                  <p className="koruna-card__meta">{product.in_stock === false ? 'Под заказ' : 'В наличии'}</p>
                  <Description text={product.description || "Описание пока не добавлено."} title={product.name} />
                  <AddButton product={product} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="koruna-catalog__state">В этом разделе пока нет товаров.</p>
        )}
      </div>
    )
  } catch {
    return <p className="koruna-catalog__state" role="alert">Не удалось загрузить каталог. Попробуйте обновить страницу.</p>
  }
}
