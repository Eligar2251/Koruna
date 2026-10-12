import { ProductCard } from '@/components/catalog/product-card'
import type { ProductWithCategory } from '@/lib/types'

export function ProductList({ products }: { products: ProductWithCategory[] }) {
  if (products.length === 0) {
    return <div className="empty">Товары скоро появятся. Позвоните нам или оставьте заявку на сайте.</div>
  }
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
