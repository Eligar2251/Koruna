import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductList } from '@/components/catalog/product-list'
import { getActiveCategories, getActiveProducts, getCategoryBySlug } from '@/lib/data'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug).catch(() => null)
  if (!category) return { title: 'Раздел не найден' }
  return {
    title: category.name,
    description: category.description ?? `${category.name} — купить в Новосибирске с доставкой.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const [category, categories, products] = await Promise.all([
    getCategoryBySlug(slug),
    getActiveCategories(),
    getActiveProducts(slug),
  ])
  if (!category) notFound()

  return (
    <>
      <div className="container page-head">
        <nav className="crumbs" aria-label="Хлебные крошки">
          <Link href="/catalog">Каталог</Link> / <span>{category.name}</span>
        </nav>
        <h1>{category.name}</h1>
        {category.description ? <p>{category.description}</p> : null}
      </div>

      <div className="container">
        <div className="chips toolbar">
          <Link href="/catalog" className="chip">
            Все товары
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/catalog/${c.slug}`} className={`chip ${c.slug === slug ? 'chip-on' : ''}`}>
              {c.name}
            </Link>
          ))}
        </div>

        <ProductList products={products} />
      </div>
    </>
  )
}
