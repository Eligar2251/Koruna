import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
      <h1>Страница не найдена</h1>
      <p className="muted">Возможно, ссылка устарела или раздел переехал.</p>
      <div className="hero-actions" style={{ justifyContent: 'center' }}>
        <Link href="/" className="btn btn-primary">
          На главную
        </Link>
        <Link href="/catalog" className="btn btn-ghost">
          Каталог
        </Link>
      </div>
    </div>
  )
}
