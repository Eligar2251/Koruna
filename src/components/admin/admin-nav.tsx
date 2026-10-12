'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/admin/products', label: 'Товары' },
  { href: '/admin/categories', label: 'Разделы' },
  { href: '/admin/leads', label: 'Заявки' },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Админка">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
