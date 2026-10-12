import type { Metadata } from 'next'
import { RequestForm } from '@/components/forms/request-form'
import { company, site } from '@/config/site'

export const metadata: Metadata = {
  title: 'Контакты',
  description: `Контакты ${site.brand}: телефон, почта, режим работы.`,
}

export default function ContactsPage() {
  const hasContacts = Boolean(site.phone || site.email || site.address || site.workHours)

  return (
    <>
      <div className="container page-head">
        <h1>Контакты</h1>
        <p>Свяжитесь с нами удобным способом или оставьте сообщение — ответим в рабочее время.</p>
      </div>

      <section className="container section-tight">
        <div className="contact-grid">
          <div className="card">
            {hasContacts ? (
              <dl className="kv">
                {site.phone ? (
                  <>
                    <dt>Телефон</dt>
                    <dd>
                      <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
                    </dd>
                  </>
                ) : null}
                {site.email ? (
                  <>
                    <dt>Почта</dt>
                    <dd>
                      <a href={`mailto:${site.email}`}>{site.email}</a>
                    </dd>
                  </>
                ) : null}
                {site.address ? (
                  <>
                    <dt>Адрес склада</dt>
                    <dd>{site.address}</dd>
                  </>
                ) : null}
                {site.workHours ? (
                  <>
                    <dt>Режим работы</dt>
                    <dd>{site.workHours}</dd>
                  </>
                ) : null}
                {site.telegram ? (
                  <>
                    <dt>Telegram</dt>
                    <dd>{site.telegram}</dd>
                  </>
                ) : null}
                {site.whatsapp ? (
                  <>
                    <dt>WhatsApp</dt>
                    <dd>{site.whatsapp}</dd>
                  </>
                ) : null}
                {site.max ? (
                  <>
                    <dt>Max</dt>
                    <dd>{site.max}</dd>
                  </>
                ) : null}
              </dl>
            ) : (
              <p className="muted">Контакты уточняются. Оставьте заявку — свяжемся с вами.</p>
            )}

            <h2 style={{ fontSize: '1.2rem', marginTop: 28 }}>Реквизиты</h2>
            <dl className="kv small">
              <dt>Организация</dt>
              <dd>{company.fullName}</dd>
              <dt>Юр. адрес</dt>
              <dd>{company.legalAddress}</dd>
              {company.inn ? (
                <>
                  <dt>ИНН</dt>
                  <dd>{company.inn}</dd>
                </>
              ) : null}
              {company.kpp ? (
                <>
                  <dt>КПП</dt>
                  <dd>{company.kpp}</dd>
                </>
              ) : null}
              {company.ogrn ? (
                <>
                  <dt>ОГРН</dt>
                  <dd>{company.ogrn}</dd>
                </>
              ) : null}
              {company.bank ? (
                <>
                  <dt>Банк</dt>
                  <dd>{company.bank}</dd>
                </>
              ) : null}
              {company.bankAccount ? (
                <>
                  <dt>Р/с</dt>
                  <dd>{company.bankAccount}</dd>
                </>
              ) : null}
              {company.bankCorrAccount ? (
                <>
                  <dt>К/с</dt>
                  <dd>{company.bankCorrAccount}</dd>
                </>
              ) : null}
              {company.bik ? (
                <>
                  <dt>БИК</dt>
                  <dd>{company.bik}</dd>
                </>
              ) : null}
            </dl>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1.2rem' }}>Написать нам</h2>
            <RequestForm type="contact" withComment submitLabel="Отправить сообщение" />
          </div>
        </div>
      </section>
    </>
  )
}
