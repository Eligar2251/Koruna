import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Админка каталога — РегионЛес',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children
}
