import './design/admin.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Админка — ЦСБ',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
