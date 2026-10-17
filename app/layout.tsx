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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="t-body" style={{ margin: 0 }}>
        <ViewportScale />
        {children}
      </body>
    </html>
  )
}
