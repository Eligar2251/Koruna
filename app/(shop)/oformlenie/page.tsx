import type { Metadata } from 'next'
import { CheckoutForm } from './CheckoutForm'
import styles from './checkout.module.css'

export const metadata: Metadata = { title: 'Оформление' }

export default function CheckoutPage() {
  return (
    <section className={styles.page}>
      <h1>Оформление</h1>
      <CheckoutForm />
    </section>
  )
}
