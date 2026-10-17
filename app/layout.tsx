import { SiteProvider } from '../components/site/SiteProvider'
import { PublicTools } from '../components/site/PublicTools'
import { publicSettings, publicCatalog } from '../lib/public-data'
import { Header } from '../components/chrome/Header'
import { PublicHeader } from '../components/chrome/PublicHeader'
import { defaultSettings } from '../lib/site-config'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import ViewportScale from '../components/chrome/ViewportScale'

export const metadata: Metadata = {
  title: 'ЦСБ — Центральная Строительная База',
  icons: { icon: '/assets/favicon.png' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [settings, catalog] = await Promise.all([publicSettings().catch(() => defaultSettings), publicCatalog().catch(() => ({ categories: [], products: [] }))])
  return (
    <html lang="ru">
      <body className="t-body" style={{ margin: 0 }}>
        <ViewportScale />
        <SiteProvider settings={settings}>
          <PublicHeader><Header categories={catalog.categories} /></PublicHeader>
          {children}
          <PublicTools />
        </SiteProvider>
      </body>
    </html>
  )
}
