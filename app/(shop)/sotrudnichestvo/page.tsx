import type { Metadata } from 'next'
import styles from './partners.module.css'

export const metadata: Metadata = { title: 'Сотрудничество' }

export default function PartnersPage() {
  return (
    <article className={styles.page}>
      <h1>Сотрудничество для строительных компаний и оптовых клиентов</h1>
      <p>Поставляем строительные материалы по оптовым ценам с быстрой отгрузкой со склада в Новосибирске.</p>
      <div className={styles.grid}>
        <p className={styles.item}>Доставка ТК по РФ</p>
        <p className={styles.item}>Бесплатное хранение</p>
        <p className={styles.item}>Склад в Новосибирске</p>
        <p className={styles.item}>Работаем с 2016 г.</p>
      </div>
      <p>
        Компания «Центральная Строительная База» приглашает к сотрудничеству строительные организации, подрядчиков, бригады и оптовые компании. Мы обеспечиваем стабильные поставки строительных материалов напрямую от производителей и помогаем закрывать объекты без задержек и переплат.
      </p>
      <section>
        <h2>Кому подходит сотрудничество</h2>
        <ul>
          <li>Строительные компании</li>
          <li>Подрядные организации</li>
          <li>Бригады и прорабы</li>
          <li>Оптовые покупатели</li>
          <li>Региональные дилеры</li>
        </ul>
      </section>
      <section>
        <h2>Доставка</h2>
        <ul>
          <li>Самовывоз со склада в Новосибирске</li>
          <li>Доставка по городу и области</li>
          <li>Отправка в регионы Сибирского федерального округа</li>
          <li>Работа с транспортными компаниями</li>
        </ul>
      </section>
      <div className={styles.grid}>
        <p className={styles.item}>Персональный менеджер</p>
        <p className={styles.item}>Оптовые цены</p>
        <p className={styles.item}>Быстрая комплектация заказов</p>
        <p className={styles.item}>Стабильные цены</p>
      </div>
      <p><a className={styles.action} href="/contact">Получить коммерческое предложение</a></p>
    </article>
  )
}
