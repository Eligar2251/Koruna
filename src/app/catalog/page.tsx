import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductList } from '@/components/catalog/product-list'
import { getActiveCategories, getActiveProducts } from '@/lib/data'
import type { Category, ProductWithCategory } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Каталог',
  description: 'Каталог строительных материалов с доставкой по Новосибирску и области.',
}

export default async function CatalogPage() {
  let categories: Category[] = []
  let products: ProductWithCategory[] = []
  try {
    ;[categories, products] = await Promise.all([getActiveCategories(), getActiveProducts()])
  } catch (e) {
    console.error('catalog', e)
  }

  return (
    <>
      <div className="container page-head">
        <h1>Каталог</h1>
        <p>Выберите товар, добавьте в корзину и отправьте заявку. Менеджер подтвердит наличие и стоимость.</p>
      </div>

      <div className="container">
        {categories.length > 0 ? (
          <div className="chips toolbar">
            <Link href="/catalog" className="chip chip-on">
              Все товары
            </Link>
            {categories.map((c) => (
              <Link key={c.id} href={`/catalog/${c.slug}`} className="chip">
                {c.name}
              </Link>
            ))}
          </div>
        ) : null}

        <ProductList products={products} />
      </div>
    </>
  )
}
