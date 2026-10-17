import './design/brand.css'
import { SiteImage } from '../site/SiteImage'
import { SiteText } from '../site/SiteProvider'

export function Brand() {
  return (
    <a className="csb-brand" href="/">
      <SiteImage className="csb-brand__mark" src="/assets/logo-mark.png" alt="" width={44} height={44} />
      <span className="csb-brand__text">
        <span className="csb-brand__short"><SiteText field="short" fallback="ЦСБ" /></span>
        <span className="csb-brand__full"><SiteText field="full" fallback="Центральная Строительная База" /></span>
      </span>
    </a>
  )
}
