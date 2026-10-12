'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { COOKIE_CONSENT_NAME } from '@/lib/legal'

// Значения: 'necessary' — только необходимые cookie, 'all' — принято полностью.
// Сейчас сайт не использует аналитику и рекламные cookie; при их добавлении
// скрипты подключаются только при значении 'all'.
export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hasChoice = document.cookie.split('; ').some((c) => c.startsWith(`${COOKIE_CONSENT_NAME}=`))
    setVisible(!hasChoice)
  }, [])

  function save(value: 'necessary' | 'all') {
    const maxAge = 60 * 60 * 24 * 365
    document.cookie = `${COOKIE_CONSENT_NAME}=${value}; path=/; max-age=${maxAge}; samesite=lax`
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="region" aria-label="Использование cookie">
      <p>
        Сайт использует cookie-файлы, которые нужны для работы сайта. Аналитических и рекламных cookie сейчас нет. Подробнее — в{' '}
        <Link href="/cookies">политике cookie</Link>.
      </p>
      <div className="cookie-actions">
        <button type="button" className="btn btn-ghost" onClick={() => save('necessary')}>
          Только необходимые
        </button>
        <button type="button" className="btn btn-primary" onClick={() => save('all')}>
          Принять
        </button>
      </div>
    </div>
  )
}
