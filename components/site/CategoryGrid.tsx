import { categoryImage, type CatalogCategory } from '../../lib/catalog'
import styles from './cards.module.css'

export function CategoryGrid({ categories }: { categories: CatalogCategory[] }) {
  if (!categories.length) return <p className={styles.empty}>Разделов нет</p>
  return (
    <div className={styles.grid}>
      {categories.map((category) => {
        const image = categoryImage(category.slug)
        return (
          <a key={category.id} className={styles.card} href={`/katalog/${category.slug}`}>
            {image
              ? <img className={styles.media} src={image} alt="" width={640} height={480} loading="lazy" decoding="async" />
              : <span className={styles.fallback} />}
            <span className={styles.body}>
              <span className={styles.title}>{category.name}</span>
              <span className={styles.more}>Открыть</span>
            </span>
          </a>
        )
      })}
    </div>
  )
}
