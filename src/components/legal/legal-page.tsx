import Link from 'next/link'
import type { ReactNode } from 'react'
import { company, site } from '@/config/site'
import { CONSENT_DATE, CONSENT_VERSION } from '@/lib/legal'

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 48 }}>
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link> / <span>{title}</span>
      </nav>
      <div className="prose">
        <h1>{title}</h1>
        <p className="doc-meta">
          Редакция от {CONSENT_DATE}, версия {CONSENT_VERSION}
        </p>
        {children}
      </div>
    </div>
  )
}

// Полное наименование оператора с реквизитами, пустые реквизиты пропускаются
export function operatorLine() {
  const parts: string[] = [company.fullName]
  if (company.ogrn) parts.push(`ОГРН ${company.ogrn}`)
  if (company.inn) parts.push(`ИНН ${company.inn}`)
  if (company.kpp) parts.push(`КПП ${company.kpp}`)
  parts.push(`юридический адрес: ${company.legalAddress}`)
  return parts.join(', ')
}

export function contactEmailText() {
  return site.email || 'указан в разделе «Контакты» сайта'
}
