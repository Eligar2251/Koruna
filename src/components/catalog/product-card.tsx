'use client'

import Link from 'next/link'
import { useCart } from '@/components/cart/cart-context'
import { formatPrice } from '@/lib/format'
import type { ProductWithCategory } from '@/lib/types'

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const { add } = useCart()
  const href = `/product/${product.slug}`

  return (
    <article className="product-card">
      <Link href={href} className="product-media" tabIndex={-1} aria-hidden="true">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt="" loading="lazy" />
        ) : (
          <span className="product-media-empty">Фото скоро появится</span>
        )}
      </Link>
      <div className="product-body">
        {product.category ? <span className="muted small">{product.category.name}</span> : null}
        <Link href={href} className="product-name">
          {product.name}
        </Link>
        <div>
          {product.in_stock ? <span className="badge">В наличии</span> : <span className="badge badge-warn">Под заказ</span>}
        </div>
        <div className="product-foot">
          <span className="price">
            {formatPrice(product.price)}
            {product.price !== null ? <small> / {product.unit}</small> : null}
          </span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => add({ id: product.id, slug: product.slug, name: product.name, price: product.price, unit: product.unit })}
          >
            В корзину
          </button>
        </div>
      </div>
    </article>
  )
}
