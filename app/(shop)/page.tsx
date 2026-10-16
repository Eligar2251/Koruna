import type { Metadata } from 'next'
import { CategoryGrid } from '../../components/site/CategoryGrid'
import { ProductGrid } from '../../components/site/ProductGrid'
import type { CatalogCategory, CatalogProduct } from '../../lib/catalog'
import { getStore } from '../../lib/server'
import styles from './home.module.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'ЦСБ — Центральная Строительная База' },
  description: 'Строительные материалы в Новосибирске: листовые материалы, утеплитель, изоляция, профиль, монтажная химия и крепёж.',
}

export default async function HomePage() {
  const catalog = await (await getStore()).catalog()
  const categories = catalog.categories as CatalogCategory[]
  const products = catalog.products as CatalogProduct[]
  return (
    <>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Новосибирск</p>
          <h1>Строительные материалы с быстрой доставкой</h1>
          <p className={styles.lead}>
            Компания «Центральная Строительная База». Листовые материалы, утеплитель, изоляция, профиль, монтажная химия и крепёж. Розница и опт.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="/katalog">Каталог</a>
            <a className={styles.secondary} href="/contact">Контакты</a>
          </div>
        </div>
        <img
          className={styles.photo}
          src="/assets/catalog/sheets.jpg"
          alt="Склад листовых материалов"
          width={1280}
          height={960}
          fetchPriority="high"
          decoding="async"
        />
      </section>
      <div className={styles.facts}>
        <p className={styles.fact}>Прямая поставка утеплителя с завода</p>
        <p className={styles.fact}>Погрузка в г. Куйбышев</p>
        <p className={styles.fact}>Отгрузка напрямую с завода, минуя склад</p>
        <p className={styles.fact}>Аккуратная разгрузка, свои грузчики</p>
      </div>
      <section className={styles.section}>
        <h2>Разделы</h2>
        <CategoryGrid categories={categories} />
      </section>
      <section className={styles.section}>
        <h2>Товары</h2>
        <ProductGrid products={products} categories={categories} />
      </section>
    </>
  )
}
