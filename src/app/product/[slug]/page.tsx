import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AddToCart } from '@/components/catalog/add-to-cart'
import { formatPrice } from '@/lib/format'
import { getActiveProductBySlug } from '@/lib/data'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getActiveProductBySlug(slug).catch(() => null)
  if (!product) return { title: 'Товар не найден' }
  return {
    title: product.name,
    description: product.description?.slice(0, 160) ?? `${product.name} — купить в Новосибирске.`,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getActiveProductBySlug(slug)
  if (!product) notFound()

  const cartItem = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price === null ? null : Number(product.price),
    unit: product.unit,
  }

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/catalog">Каталог</Link>
        {product.category ? (
          <>
            {' / '}
            <Link href={`/catalog/${product.category.slug}`}>{product.category.name}</Link>
          </>
        ) : null}
        {' / '}
        <span>{product.name}</span>
      </nav>

      <div className="product-detail">
        <div className="product-detail-media">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} />
          ) : (
            <span className="muted">Фото скоро появится</span>
          )}
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          {product.sku ? <p className="muted small">Артикул: {product.sku}</p> : null}
          <div>
            {product.in_stock ? <span className="badge">В наличии</span> : <span className="badge badge-warn">Под заказ</span>}
          </div>
          <p className="product-detail-price">
            {formatPrice(product.price)}
            {product.price !== null ? <span className="muted small"> за {product.unit}</span> : null}
          </p>
          <AddToCart product={cartItem} />
          {product.description ? <div className="lines">{product.description}</div> : null}
        </div>
      </div>
    </div>
  )
}
