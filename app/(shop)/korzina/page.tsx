import type { Metadata } from 'next'
import { CartView } from './CartView'
import styles from './cart.module.css'

export const metadata: Metadata = { title: 'Корзина' }

export default function CartPage() {
  return (
    <section className={styles.page}>
      <h1>Корзина</h1>
      <CartView />
    </section>
  )
}
