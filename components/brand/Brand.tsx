import './design/brand.css'

export function Brand() {
  return (
    <a className="csb-brand" href="/">
      <img className="csb-brand__mark" src="/assets/logo-mark.png" alt="" width={44} height={44} />
      <span className="csb-brand__text">
        <span className="csb-brand__short">ЦСБ</span>
        <span className="csb-brand__full">Центральная Строительная База</span>
      </span>
    </a>
  )
}
