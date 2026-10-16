import { SiteShell } from '../components/site/SiteShell'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <SiteShell>
      <div className={styles.box}>
        <h1>Страница не найдена</h1>
        <a className={styles.link} href="/">На главную</a>
      </div>
    </SiteShell>
  )
}
