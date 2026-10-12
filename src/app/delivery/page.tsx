import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/config/site'

export const metadata: Metadata = {
  title: 'Доставка и оплата',
  description: `Доставка и самовывоз строительных материалов: ${site.deliveryArea}.`,
}

export default function DeliveryPage() {
  return (
    <>
      <div className="container page-head">
        <h1>Доставка и оплата</h1>
        <p>Доставляем по {site.deliveryArea}. За пределы области доставка не осуществляется.</p>
      </div>

      <section className="container section-tight">
        <div className="steps">
          <div className="step">
            <h3>Самовывоз</h3>
            <p>Заберите заказ со склада. Менеджер сообщит, когда заказ готов к выдаче.</p>
            {site.address ? <p className="small">{site.address}</p> : null}
            {site.workHours ? <p className="small muted">{site.workHours}</p> : null}
          </div>
          <div className="step">
            <h3>Доставка</h3>
            <p>
              Доставка по {site.city} и Новосибирской области. Срок и стоимость зависят от объёма и адреса, их
              подтверждает менеджер.
            </p>
          </div>
          <div className="step">
            <h3>Оплата</h3>
            <p>Способ оплаты согласовывается с менеджером при подтверждении заказа. Для юридических лиц и ИП оформляем счёт и закрывающие документы.</p>
          </div>
        </div>
      </section>

      <section className="container section-tight">
        <div className="card" style={{ maxWidth: 760 }}>
          <h2 style={{ fontSize: '1.3rem' }}>Как оформить заказ</h2>
          <ol style={{ paddingLeft: 22, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Добавьте товары в корзину в <Link href="/catalog">каталоге</Link>.</li>
            <li>Укажите имя, удобный способ связи и способ получения.</li>
            <li>Отправьте заявку. Менеджер свяжется с вами и подтвердит наличие и стоимость.</li>
          </ol>
        </div>
      </section>
    </>
  )
}
