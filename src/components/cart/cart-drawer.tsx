'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { OrderForm } from '@/components/forms/order-form'
import { formatPrice, pluralizeItems } from '@/lib/format'
import { useCart } from './cart-context'

export function CartDrawer() {
  const { isOpen, close, items, total, count, setQty, remove } = useCart()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  return (
    <AnimatePresence>
    {isOpen ? (
    <div className="drawer-root" key="drawer">
      <motion.button type="button" className="drawer-overlay" aria-label="Закрыть корзину" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
      <motion.aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 40 }}>
        <div className="drawer-head">
          <h2 id="cart-title" className="drawer-title">
            Корзина {count > 0 ? <span className="muted">· {pluralizeItems(items.length)}</span> : null}
          </h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Закрыть">
            ×
          </button>
        </div>

        <div className="drawer-body">
          {items.length > 0 ? (
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="muted small">{formatPrice(item.price)}{item.price !== null ? ` / ${item.unit}` : ''}</p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty">
                      <button type="button" aria-label="Уменьшить" onClick={() => setQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>
                        −
                      </button>
                      <input
                        aria-label="Количество"
                        inputMode="numeric"
                        value={item.qty}
                        onChange={(e) => setQty(item.id, Number(e.target.value.replace(/\D/g, '')))}
                      />
                      <button type="button" aria-label="Увеличить" onClick={() => setQty(item.id, item.qty + 1)}>
                        +
                      </button>
                    </div>
                    <button type="button" className="link-btn" onClick={() => remove(item.id)}>
                      Удалить
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Корзина пуста. Добавьте товары из каталога.</p>
          )}

          {items.length > 0 ? (
            <div className="cart-total">
              <span>Итого</span>
              <strong>{total === null ? 'Уточняется менеджером' : formatPrice(total)}</strong>
            </div>
          ) : null}

          <div className="drawer-form">
            <h3 className="drawer-subtitle">Оформление заявки</h3>
            <OrderForm />
          </div>
        </div>
      </motion.aside>
    </div>
    ) : null}
    </AnimatePresence>
  )
}
