'use client'

import { useEffect } from 'react'
import './design/menu.css'

export function MenuButton() {
  useEffect(() => {
    const close = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      if (!target.closest('#t-header a[href]')) return
      document.querySelectorAll('.csb-nav-open').forEach((node) => node.classList.remove('csb-nav-open'))
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  return (
    <button
      type="button"
      className="t-menu-burger t-menuburger"
      aria-label="Навигационное меню"
      aria-expanded="false"
      onClick={(event) => {
        const root = event.currentTarget.closest('#t-header') || document
        const nav = root.querySelector('.tmenu-mobile__menucontent_hidden, .t-menu-base')
        nav?.classList.toggle('csb-nav-open')
        event.currentTarget.setAttribute(
          'aria-expanded',
          nav?.classList.contains('csb-nav-open') ? 'true' : 'false',
        )
      }}
    >
      <div className="t-menu-burger__icon t-menu-burger__icon_first t-menu-burger__icon_small">
        <span style={{ backgroundColor: '#000000' }} />
        <span style={{ backgroundColor: '#000000' }} />
        <span style={{ backgroundColor: '#000000' }} />
        <span style={{ backgroundColor: '#000000' }} />
      </div>
    </button>
  )
}
