import './design/brand.css'
import { NavLink } from '../chrome/NavLink'
import { SiteImage } from '../site/SiteImage'
import { SiteText } from '../site/SiteProvider'

export function Brand() {
  return (
    <NavLink className="csb-brand" href="/">
      <SiteImage className="csb-brand__mark" src="/assets/logo-mark.png" alt="" loading="eager" width={44} height={44} />
      <span className="csb-brand__text">
        <span className="csb-brand__short"><SiteText field="short" fallback="ЦСБ" /></span>
        <span className="csb-brand__full"><SiteText field="full" fallback="Центральная Строительная База" /></span>
      </span>
    </NavLink>
  )
}
