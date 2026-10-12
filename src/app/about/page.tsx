import type { Metadata } from 'next'
import Link from 'next/link'
import { company, site } from '@/config/site'

export const metadata: Metadata = {
  title: 'О компании',
  description: `${site.brand} — поставки строительных материалов в ${site.city} и область.`,
}

export default function AboutPage() {
  return (
    <>
      <div className="container page-head">
        <h1>О компании</h1>
        <p>
          {site.brand} — поставщик строительных материалов для частных застройщиков, строительных бригад и подрядных
          организаций в {site.city} и Новосибирской области.
        </p>
      </div>

      <section className="container section-tight">
        <div className="contact-grid">
          <div className="card">
            <h2 style={{ fontSize: '1.3rem' }}>Что мы делаем</h2>
            <ul className="list">
              <li>Листовые материалы</li>
              <li>Утеплители и пароизоляция</li>
              <li>Поликарбонат, профиль и каркас</li>
              <li>Монтажная химия, крепёж</li>
              <li>Кровельные материалы</li>
            </ul>
            <Link href="/catalog" className="btn btn-primary">
              Перейти в каталог
            </Link>
          </div>
          <div className="card">
            <h2 style={{ fontSize: '1.3rem' }}>Работаем по договору</h2>
            <p className="muted">
              Для постоянных клиентов возможны регулярные поставки на объект, счёт и полный комплект закрывающих
              документов.
            </p>
            <p className="small muted" style={{ marginBottom: 0 }}>
              Оператор: {company.fullName}. Юридический адрес: {company.legalAddress}.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
