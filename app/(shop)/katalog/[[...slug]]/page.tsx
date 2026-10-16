import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryGrid } from '../../../../components/site/CategoryGrid'
import { ProductGrid } from '../../../../components/site/ProductGrid'
import { productsIn, type CatalogCategory, type CatalogProduct } from '../../../../lib/catalog'
import { getStore } from '../../../../lib/server'
import styles from '../catalog.module.css'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug?: string[] }> }

async function load(slug: string) {
  const catalog = await (await getStore()).catalog()
  const categories = catalog.categories as CatalogCategory[]
  const products = catalog.products as CatalogProduct[]
  const category = slug ? categories.find((item) => item.slug === slug) : null
  return { categories, products, category }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = ((await params).slug || []).at(-1) || ''
  if (!slug) return { title: 'Каталог' }
  const { category } = await load(slug)
  return { title: category?.name || 'Каталог' }
}

export default async function CatalogPage({ params }: Props) {
  const parts = (await params).slug || []
  const slug = parts.at(-1) || ''
  const { categories, products, category } = await load(slug)
  if (slug && !category) notFound()
  const shown = slug ? productsIn(products, categories, slug) : products
  return (
    <>
      <div className={styles.top}>
        {slug ? <p className={styles.crumb}><a href="/katalog">Каталог</a></p> : null}
        <h1>{category?.name || 'Каталог'}</h1>
      </div>
      {slug ? null : (
        <section className={styles.block}>
          <h2>Разделы</h2>
          <CategoryGrid categories={categories} />
        </section>
      )}
      <section className={styles.block}>
        {slug ? null : <h2>Товары</h2>}
        <ProductGrid products={shown} categories={categories} />
      </section>
    </>
  )
}
