import { Footer } from '../chrome/Footer'
import { Header } from '../chrome/Header'
import { CatalogFill } from './CatalogFill'

export function CatalogOnly({ slug }: { slug: string }) {
  return (
    <>
      <Header />
      <div className="r t-rec koruna-rec">
        <CatalogFill mode={slug ? 'category' : 'all'} slug={slug} />
      </div>
      <Footer />
    </>
  )
}
