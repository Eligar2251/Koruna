import Link from 'next/link'
import { LogoMark } from '@/components/brand/logo'
import { company, site } from '@/config/site'

export function Footer() {
  const year = new Date().getFullYear()
  const requisites: [string, string][] = [
    ['ИНН', company.inn],
    ['КПП', company.kpp],
    ['ОГРН', company.ogrn],
  ].filter((r): r is [string, string] => Boolean(r[1]))

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <LogoMark size={32} />
            <span>{site.brand}</span>
          </div>
          <p className="muted small">Строительные материалы в {site.city} и области</p>
        </div>

        <nav className="footer-col" aria-label="Разделы сайта">
          <p className="footer-title">Покупателям</p>
          <Link href="/catalog">Каталог</Link>
          <Link href="/delivery">Доставка и оплата</Link>
          <Link href="/about">О компании</Link>
          <Link href="/contacts">Контакты</Link>
        </nav>

        <nav className="footer-col" aria-label="Документы">
          <p className="footer-title">Документы</p>
          <Link href="/privacy">Политика обработки персональных данных</Link>
          <Link href="/consent">Согласие на обработку персональных данных</Link>
          <Link href="/cookies">Политика cookie</Link>
        </nav>

        <div className="footer-col">
          <p className="footer-title">Реквизиты</p>
          <p className="small">{company.fullName}</p>
          {company.legalAddress ? <p className="small">Юридический адрес: {company.legalAddress}</p> : null}
          {requisites.map(([label, value]) => (
            <p key={label} className="small">
              {label} {value}
            </p>
          ))}
        </div>
      </div>
      <div className="container footer-bottom small muted">
        <span>© {year} {company.name}</span>
      </div>
    </footer>
  )
}
