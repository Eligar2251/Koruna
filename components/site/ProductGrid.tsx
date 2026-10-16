import { formatPrice } from '../../lib/format'
import type { CatalogCategory, CatalogProduct } from '../../lib/catalog'
import { AddButton } from './AddButton'
import styles from './cards.module.css'

export function ProductGrid({ products, categories }: { products: CatalogProduct[]; categories: CatalogCategory[] }) {
  const names = new Map(categories.map((item) => [item.id, item.name]))
  if (!products.length) return <p className={styles.empty}>Товаров нет</p>
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <article key={product.id} className={styles.card}>
          {product.image_url
            ? <img className={styles.media} src={product.image_url} alt="" width={640} height={480} loading="lazy" decoding="async" />
            : <span className={styles.fallback} />}
          <div className={styles.body}>
            <h3 className={styles.title}>{product.name}</h3>
            <p className={styles.meta}>{names.get(product.category_id || '') || product.unit || 'шт'}</p>
            <p className={styles.price}>{formatPrice(product.price)}{product.unit ? ` / ${product.unit}` : ''}</p>
            <AddButton product={product} />
          </div>
        </article>
      ))}
    </div>
  )
}
