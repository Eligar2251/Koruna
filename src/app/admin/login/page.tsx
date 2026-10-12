import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { signIn } from '@/actions/admin-auth'
import { LogoMark } from '@/components/brand/logo'
import { getCurrentAdmin } from '@/lib/data'

export const metadata: Metadata = { title: 'Вход в админку', robots: { index: false, follow: false } }

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  if (await getCurrentAdmin()) redirect('/admin/products')

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <LogoMark size={32} />
          <strong style={{ fontSize: '1.15rem' }}>Вход в админку</strong>
        </div>
        <form action={signIn} className="form">
          <div className="field">
            <label className="field-label" htmlFor="email">Почта</label>
            <input id="email" name="email" type="email" className="input" required autoComplete="username" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="password">Пароль</label>
            <input id="password" name="password" type="password" className="input" required autoComplete="current-password" />
          </div>
          {error ? <p className="form-error" role="alert">Неверная почта или пароль</p> : null}
          <button type="submit" className="btn btn-primary btn-block">Войти</button>
        </form>
      </div>
    </div>
  )
}
