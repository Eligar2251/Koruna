import type { ReactElement } from 'react'
import type { Metadata } from 'next'
import { CatalogOnly } from '../../../components/catalog/CatalogOnly'
import { catalogPages, catalogTitles } from '../../../components/pages/registry'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug?: string[] }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params
  const key = slug.join('/')
  const titles = catalogTitles as Record<string, string>
  return { title: titles[key] || 'Каталог — ЦСБ' }
}

export default async function Page({ params }: Props) {
  const { slug = [] } = await params
  const key = slug.join('/')
  const pages = catalogPages as Record<string, () => ReactElement>
  const Found = pages[key]
  if (Found) return <Found />
  return <CatalogOnly slug={slug.at(-1) || ''} />
}
