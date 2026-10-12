import Link from 'next/link'
import { RequestForm } from '@/components/forms/request-form'
import { site } from '@/config/site'
import { getActiveCategories } from '@/lib/data'
import type { Category } from '@/lib/types'

export const revalidate = 60

export default async function HomePage() {
  let categories: Category[] = []
  try {
    categories = await getActiveCategories()
  } catch (e) {
    console.error('home categories', e)
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">{site.city} и область</span>
            <h1>Строительные материалы для вашего объекта</h1>
            <p className="lead">
              Листовые материалы, утеплители, профиль, крепёж и монтажная химия. Соберите заказ в корзине,
              менеджер подтвердит наличие и стоимость.
            </p>
            <div className="hero-actions">
              <Link href="/catalog" className="btn btn-primary">
                Открыть каталог
              </Link>
              <a href="#callback" className="btn btn-ghost">
                Заказать звонок
              </a>
            </div>
          </div>

          <div className="hero-panel" aria-hidden="true">
            <div className="stack">
              {categories.slice(0, 4).map((c) => (
                <div key={c.id} className="stack-row">
                  <span>{c.name}</span>
                  <span>в каталоге</span>
                </div>
              ))}
              <div className="stack-row accent">
                <span>Доставка</span>
                <span>{site.deliveryArea}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="steps">
            <div className="step">
              <span className="step-num">1</span>
              <h3>Соберите корзину</h3>
              <p>Добавьте нужные позиции и количество. Цены и наличие видны в карточке товара.</p>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <h3>Выберите способ связи</h3>
              <p>Телефон, почта, Telegram, WhatsApp или Max — как вам удобнее.</p>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <h3>Получите подтверждение</h3>
              <p>Менеджер уточнит наличие, стоимость и способ получения: самовывоз или доставка.</p>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 ? (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>Категории</h2>
              <p>Выберите раздел или откройте полный каталог.</p>
            </div>
            <div className="cat-grid">
              {categories.map((c) => (
                <Link key={c.id} href={`/catalog/${c.slug}`} className="cat-card">
                  <span className="cat-card-name">{c.name}</span>
                  <span className="cat-card-arrow">Смотреть товары →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" id="callback">
        <div className="container">
          <div className="callout">
            <div>
              <h2>Подберём материалы под ваш объект</h2>
              <ul className="list">
                <li>Расчёт по чертежу или смете</li>
                <li>Отгрузка из Новосибирска</li>
                <li>Доставка по {site.deliveryArea}</li>
              </ul>
              <p className="muted small">
                Оставьте телефон или почту — перезвоним в рабочее время.
              </p>
            </div>
            <RequestForm type="callback" submitLabel="Заказать звонок" />
          </div>
        </div>
      </section>
    </>
  )
}
