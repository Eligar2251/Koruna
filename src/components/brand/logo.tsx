import Link from 'next/link'
import { site } from '@/config/site'

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="csb-mark" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2BB37F" />
          <stop offset="1" stopColor="#0F5A43" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#csb-mark)" />
      <rect x="10" y="11" width="28" height="6" rx="3" fill="#FFFFFF" />
      <rect x="10" y="21" width="20" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.6" />
      <rect x="10" y="31" width="28" height="6" rx="3" fill="#9BD65C" />
    </svg>
  )
}

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${site.brand} — на главную`}>
      <LogoMark />
      <span className="logo-word">{site.brand}</span>
    </Link>
  )
}
