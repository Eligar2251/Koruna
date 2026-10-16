import type { Metadata } from 'next'
import { site } from '../../../lib/site'
import styles from './privacy.module.css'

export const metadata: Metadata = { title: 'Политика конфиденциальности' }

export default function PrivacyPage() {
  return (
    <article className={styles.page}>
      <h1>Политика конфиденциальности</h1>
      <p>{site.full} принимает имя, телефон, почту и адрес только для оформления заказа и связи по нему.</p>
      <p>Эти данные не публикуются на сайте и не передаются в открытый каталог.</p>
      <p>По вопросам данных: <a href={`mailto:${site.email}`}>{site.email}</a>, {site.address}.</p>
    </article>
  )
}
