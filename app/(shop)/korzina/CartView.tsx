'use client'

import { formatPrice } from '../../../lib/format'
import { useCart } from '../../../components/site/cart'
import styles from './cart.module.css'

export function CartView() {
  const cart = useCart()
  if (!cart.ready) return null
  const priced = cart.items.filter((item) => item.price !== null)
  const total = priced.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0)
  if (!cart.items.length) {
    return (
      <>
        <p className={styles.empty}>Корзина пуста</p>
        <p><a className={styles.go} href="/katalog">В каталог</a></p>
      </>
    )
  }
  return (
    <>
      <ul className={styles.list}>
        {cart.items.map((item) => (
          <li key={item.id} className={styles.row}>
            {item.image
              ? <img className={styles.photo} src={item.image} alt="" width={88} height={72} />
              : <span className={styles.fallback} />}
            <div>
              <p className={styles.name}>{item.name}</p>
              <p className={styles.price}>{formatPrice(item.price)} / {item.unit}</p>
            </div>
            <div className={styles.qty}>
              <button type="button" onClick={() => cart.setQty(item.id, item.qty - 1)} aria-label="Меньше">−</button>
              <span>{item.qty}</span>
              <button type="button" onClick={() => cart.setQty(item.id, item.qty + 1)} aria-label="Больше">+</button>
              <button type="button" className={styles.remove} onClick={() => cart.remove(item.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
      <p className={styles.total}>{priced.length ? formatPrice(total) : 'по запросу'}</p>
      <p><a className={styles.go} href="/oformlenie">Оформить</a></p>
    </>
  )
}
