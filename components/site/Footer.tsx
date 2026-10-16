import { nav, site } from '../../lib/site'
import styles from './shell.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.foot}>
        <div>
          <p className={styles.brand}>{site.short}</p>
          <p className={styles.muted}>{site.full}</p>
          <p className={styles.copy}>{site.legal}</p>
          <p className={styles.copy}>ИНН {site.inn}</p>
          <p className={styles.copy}>ОГРН {site.ogrn}</p>
        </div>
        <div>
          <h2>Контакты</h2>
          <p>{site.address}</p>
          <p>{site.officeHours}</p>
          {site.phones.map((phone) => (
            <p key={phone.href}><a href={phone.href}>{phone.label}</a></p>
          ))}
          <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
        </div>
        <div>
          <h2>Разделы</h2>
          <ul>
            {nav.map((item) => (
              <li key={item.href}><a href={item.href}>{item.label}</a></li>
            ))}
            <li><a href="/politika">Политика конфиденциальности</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
