import { ProductGrid } from './ProductGrid'
import { SiteImage } from '../site/SiteImage'
import { categoryHref, categoryImage, productsIn, type CatalogCategory, type CatalogProduct } from '../../lib/catalog'
import { publicCatalog } from '../../lib/public-data'
import './design/catalog.css'

export async function CatalogFill({ mode, slug }: { mode: string; slug: string }) {
  if (mode === 'home') return null
  try {
    const data = await publicCatalog()
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
                  <div className="koruna-card__media"><SiteImage slot={`category:${item.slug}`} src={image || '/assets/image-unavailable.svg'} alt="" /></div>
                  <div className="koruna-card__body">
                    <h3>{item.name}</h3>
                  </div>
                </a>
              )
            })}
          </div>
        ) : null}
        <ProductGrid products={visible} categories={categories} />
      </div>
    )
  } catch {
    return <p className="koruna-catalog__state" role="alert">Не удалось загрузить каталог. Попробуйте обновить страницу.</p>
  }
}
