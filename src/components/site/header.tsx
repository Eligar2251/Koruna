'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '@/components/brand/logo'
import { useCart } from '@/components/cart/cart-context'
import { site } from '@/config/site'

const nav = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/delivery', label: 'Доставка и оплата' },
  { href: '/about', label: 'О компании' },
  { href: '/contacts', label: 'Контакты' },
]

export function Header() {
  const { count, open } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="container header-row">
        <Logo />

        <nav className="nav-desktop" aria-label="Основная навигация">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {site.phone ? (
            <a className="header-phone" href={`tel:${site.phoneHref}`}>
              {site.phone}
            </a>
          ) : null}
          <button type="button" className="cart-button" onClick={open} aria-label="Открыть корзину">
            <CartIcon />
            <span>Корзина</span>
            {count > 0 ? <span className="cart-count">{count}</span> : null}
          </button>
          <button
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">Меню</span>
            <span className="burger" aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="mobile-menu" className="nav-mobile" aria-label="Мобильная навигация">
          <div className="container">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link" onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            {site.phone ? (
              <a className="nav-link" href={`tel:${site.phoneHref}`}>
                {site.phone}
              </a>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="9.5" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </svg>
  )
}
