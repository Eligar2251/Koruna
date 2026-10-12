import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signOut } from '@/actions/admin-auth'
import { getCurrentAdmin } from '@/lib/data'
import { AdminNav } from '@/components/admin/admin-nav'

export const dynamic = 'force-dynamic'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login')

  return (
    <div className="container" style={{ maxWidth: 'none', padding: 0 }}>
      <div className="admin-shell">
        <aside className="admin-nav">
          <AdminNav />
          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <p className="small muted" style={{ wordBreak: 'break-all' }}>{admin.email}</p>
            <form action={signOut}>
              <button type="submit" className="btn btn-ghost btn-sm btn-block">Выйти</button>
            </form>
            <Link href="/" className="small" style={{ display: 'block', marginTop: 10 }}>
              На сайт
            </Link>
          </div>
        </aside>
        <div className="admin-main">{children}</div>
      </div>
    </div>
  )
}
