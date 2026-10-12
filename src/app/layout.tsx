import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { CartProvider } from '@/components/cart/cart-context'
import { CookieBanner } from '@/components/site/cookie-banner'
import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { site } from '@/config/site'
import '@fontsource-variable/manrope'
import '@fontsource-variable/unbounded'
import { MotionProvider } from '@/components/motion/motion-provider'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: '%s — ЦСБ' },
  description: site.description,
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.brand,
    locale: 'ru_RU',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: "#0F6B4F",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="stylesheet" href="/_ext/fonts.googleapis.com/css2/inter.css" />
      </head>
      <body>
        <MotionProvider>
        <CartProvider>
          <a href="#main" className="skip-link">
            Перейти к содержимому
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <CookieBanner />
        </CartProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
