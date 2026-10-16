import type { Metadata } from 'next'
import { site } from '../../../lib/site'
import styles from './contact.module.css'

export const metadata: Metadata = { title: 'Контакты' }

export default function ContactPage() {
  return (
    <article className={styles.page}>
      <h1>Контакты</h1>
      <div className={styles.grid}>
        <section className={styles.card}>
          <h2>Адрес</h2>
          <p>{site.address}</p>
        </section>
        <section className={styles.card}>
          <h2>Режим работы</h2>
          <p>{site.officeHours}</p>
        </section>
        <section className={styles.card}>
          <h2>Телефон</h2>
          {site.phones.map((phone) => (
            <a key={phone.href} href={phone.href}>{phone.label}</a>
          ))}
        </section>
        <section className={styles.card}>
          <h2>Почта</h2>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </section>
      </div>
      <img className={styles.photo} src="/assets/catalog/rolls.jpg" alt="Склад утеплителя" width={1280} height={960} />
    </article>
  )
}
