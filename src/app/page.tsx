import Link from 'next/link'
import { ArrowUpRight, Boxes, Layers, PackageCheck, Ruler, Truck, Wrench } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { RequestForm } from '@/components/forms/request-form'
import { site } from '@/config/site'
import { getActiveCategories } from '@/lib/data'
import type { Category } from '@/lib/types'

export const revalidate = 60

const icons = [Layers, Boxes, Ruler, Wrench, PackageCheck, Truck, Layers, Boxes]

const steps = [
  { title: 'Соберите корзину', text: 'Добавьте позиции и количество. Цены видны в карточке товара.' },
  { title: 'Выберите связь', text: 'Телефон, почта, Telegram, WhatsApp или Max — как вам удобнее.' },
  { title: 'Получите подтверждение', text: 'Менеджер уточнит наличие, стоимость и самовывоз или доставку.' },
]

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
        <div className="container hero-inner">
          <Reveal className="hero-copy">
            <span className="eyebrow">{site.city} и область</span>
            <h1 className="display">
              Материалы, которые <span className="gradient-text">встают</span> в срок
            </h1>
            <p className="lead">
              Листовые материалы, утепление, профиль и крепёж. Соберите заказ, а менеджер подтвердит наличие и цену.
            </p>
            <div className="hero-actions">
              <Link href="/catalog" className="btn btn-primary">
                Открыть каталог <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <a href="#callback" className="btn btn-ghost">
                Заказать звонок
              </a>
            </div>
          </Reveal>

          <Reveal className="hero-media" delay={0.15}>
            <div className="hero-image">
              <img src="/images/hero.jpg" alt="Складирование листовых и изоляционных материалов" width={1200} height={900} fetchPriority="high" decoding="async" />
            </div>
            <div className="hero-badge">
              <span className="hero-badge-num">{categories.length || 8}</span>
              <span>разделов в каталоге</span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div className="marquee-group" key={i}>
              {(categories.length ? categories.map((c) => c.name) : ['Листовые материалы', 'Утеплители', 'Профиль', 'Крепёж']).map((name) => (
                <span key={name + i}>{name}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {categories.length > 0 ? (
        <section className="section">
          <div className="container">
            <Reveal className="section-head">
              <h2>Каталог</h2>
              <p>Выберите раздел — все позиции с ценами и наличием.</p>
            </Reveal>
            <div className="bento">
              {categories.map((c, i) => {
                const Icon = icons[i % icons.length]
                return (
                  <Reveal key={c.id} delay={(i % 4) * 0.05}>
                    <Link href={`/catalog/${c.slug}`} className="bento-card">
                      <span className="bento-icon">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      <span className="bento-name">{c.name}</span>
                      <span className="bento-go">
                        Смотреть <ArrowUpRight size={16} aria-hidden="true" />
                      </span>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2>Как это работает</h2>
            <p>Три шага от корзины до подтверждённого заказа.</p>
          </Reveal>
          <div className="timeline">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08} className="timeline-step">
                <span className="timeline-num">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="callback">
        <div className="container">
          <Reveal className="callout">
            <div>
              <h2>Подберём материалы под ваш объект</h2>
              <ul className="list">
                <li>Расчёт по чертежу или смете</li>
                <li>Отгрузка из Новосибирска</li>
                <li>Доставка по {site.deliveryArea}</li>
              </ul>
              <p className="muted small">Оставьте телефон или почту — перезвоним в рабочее время.</p>
            </div>
            <RequestForm type="callback" submitLabel="Заказать звонок" />
          </Reveal>
        </div>
      </section>
    </>
  )
}
