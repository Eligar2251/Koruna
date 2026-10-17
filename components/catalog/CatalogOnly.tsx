import { Footer } from '../chrome/Footer'
import { CatalogFill } from './CatalogFill'

export function CatalogOnly({ slug }: { slug: string }) {
  return (
    <div id="allrecords" className="t-records">

      <div className="r t-rec koruna-rec">
        <CatalogFill mode={slug ? 'category' : 'all'} slug={slug} />
      </div>
      <Footer />
    </div>
  )
}
