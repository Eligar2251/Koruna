import type { Metadata } from 'next'
import styles from './about.module.css'

export const metadata: Metadata = { title: 'О компании' }

export default function AboutPage() {
  return (
    <article className={styles.page}>
      <h1>Компания «Центральная Строительная База»</h1>
      <p className={styles.lead}>
        Мы предлагаем широкий ассортимент продукции для частного и коммерческого строительства: от листовых материалов до утеплителя, изоляции, профиля, монтажной химии и крепежа.
      </p>
      <img className={styles.photo} src="/assets/catalog/gypsum.jpg" alt="Склад гипсокартона" width={896} height={1195} />
      <div>
        <p className={styles.text}>В нашем каталоге вы можете купить:</p>
        <ul className={styles.list}>
          <li>ОСП-3 (OSB) различной толщины</li>
          <li>Гипсокартон, в том числе влагостойкий</li>
          <li>Утеплитель</li>
          <li>Гидро- и пароизоляцию, мембраны</li>
          <li>Профиль для гипсокартона</li>
          <li>Монтажную пену и строительную химию</li>
        </ul>
      </div>
      <p className={styles.text}>Все товары доступны как в розницу, так и оптом.</p>
      <p className={styles.text}>
        Если вам нужно купить строительные материалы в Новосибирске по выгодной цене с быстрой доставкой — обращайтесь в компанию «ЦСБ». Мы поможем подобрать необходимые материалы, рассчитаем стоимость и обеспечим оперативную поставку на ваш объект.
      </p>
      <div className={styles.grid}>
        <p className={styles.item}>Прямая поставка утеплителя с завода</p>
        <p className={styles.item}>Погрузка в г. Куйбышев</p>
        <p className={styles.item}>Отгрузка напрямую с завода, минуя склад</p>
        <p className={styles.item}>Аккуратная разгрузка, свои грузчики</p>
      </div>
    </article>
  )
}
