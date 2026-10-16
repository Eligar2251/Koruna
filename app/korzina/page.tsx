import type { Metadata } from 'next'
import { Footer } from '../../components/chrome/Footer'
import { Header } from '../../components/chrome/Header'
import { CartView } from '../../components/pages/korzina/CartView'

export const metadata: Metadata = {
  title: 'Корзина — ЦСБ',
}

export default function Page() {
  return (
    <>
      <Header />
      <CartView />
      <Footer />
    </>
  )
}
