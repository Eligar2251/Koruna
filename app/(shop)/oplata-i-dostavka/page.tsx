import type { Metadata } from 'next'
import { site } from '../../../lib/site'
import styles from './delivery.module.css'

export const metadata: Metadata = { title: 'Оплата и доставка' }

export default function DeliveryPage() {
  return (
    <article className={styles.page}>
      <h1>Доставка и оплата</h1>
      <div className={styles.columns}>
        <section className={styles.card}>
          <h2>Оплата</h2>
          <p>В данный момент у нас действуют следующие способы оплаты:</p>
          <p>Оплата наличными или банковской картой возможна в офисе по адресу: {site.address}.</p>
          <p>Оплата по безналичному расчёту на реквизиты компании.</p>
          <p>Для юридических лиц предоставляем полный комплект документов.</p>
        </section>
        <section className={styles.card}>
          <h2>Реквизиты</h2>
          <p>{site.legalFull}</p>
          <p>ИНН {site.inn}</p>
          <p>ОГРН {site.ogrn}</p>
          <p>р/с {site.account}</p>
          <p>{site.bank}</p>
          <p>БИК {site.bik}</p>
        </section>
      </div>
      <section className={styles.card}>
        <h2>Самовывоз</h2>
        <p>Вы можете самостоятельно забрать заказанные товары с нашего склада в Новосибирске по адресу {site.address}.</p>
        <p>{site.warehouseHours}</p>
      </section>
      <section className={styles.card}>
        <h2>Доставка</h2>
        <p>Мы осуществляем доставку строительных материалов:</p>
        <ul>
          <li>По Новосибирску</li>
          <li>По Новосибирской области</li>
          <li>В регионы Сибирского федерального округа</li>
        </ul>
        <p>Возможна доставка в день заказа при наличии товара на складе. Стоимость рассчитывается индивидуально в зависимости от объёма и адреса.</p>
        <p><a href="/contact">Связаться</a></p>
      </section>
    </article>
  )
}
