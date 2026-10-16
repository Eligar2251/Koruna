'use client'

import { nav, site } from '../../lib/site'
import { useCart } from './cart'
import styles from './shell.module.css'

export function Header() {
  const cart = useCart()
  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <a className={styles.brand} href="/" aria-label={site.full}>
          <img className={styles.mark} src="/assets/logo-mark.png" alt="" width={52} height={52} />
          <span className={styles.brandText}>
            <span className={styles.brandShort}>{site.short}</span>
            <span className={styles.brandFull}>{site.full}</span>
          </span>
        </a>
        <nav className={styles.nav} aria-label="Меню">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <div className={styles.side}>
          <div className={styles.phones}>
            {site.phones.map((phone) => (
              <a key={phone.href} href={phone.href}>{phone.label}</a>
            ))}
          </div>
          <a className={styles.cart} href="/korzina">Корзина {cart.count}</a>
        </div>
      </div>
    </header>
  )
}
