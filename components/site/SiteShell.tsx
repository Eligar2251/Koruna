'use client'

import type { ReactNode } from 'react'
import { CartProvider } from './cart'
import { Footer } from './Footer'
import { Header } from './Header'
import styles from './shell.module.css'

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </CartProvider>
  )
}
