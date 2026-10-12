import Link from 'next/link'
import { deleteProduct } from '@/actions/admin-products'
import { getAdminProducts } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'

export const metadata = { title: 'Товары — админка' }

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams
  const products = await getAdminProducts()

  return (
    <>
      <div className="admin-top">
        <h1>Товары</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          Новый товар
        </Link>
      </div>

      {saved ? <p className="notice notice-ok small" style={{ padding: '10px 14px' }}>Изменения сохранены</p> : null}

      {products.length === 0 ? (
        <div className="empty">Товаров пока нет. Добавьте первый.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Товар</th>
                <th>Раздел</th>
                <th>Цена</th>
                <th>Наличие</th>
                <th>На сайте</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/products/${p.id}`} style={{ fontWeight: 600 }}>
                      {p.name}
                    </Link>
                    <div className="small muted">/{p.slug}</div>
                  </td>
                  <td>{p.category?.name ?? '—'}</td>
                  <td>{p.price === null ? 'По запросу' : `${formatPrice(p.price)} / ${p.unit}`}</td>
                  <td>{p.in_stock ? 'В наличии' : 'Под заказ'}</td>
                  <td>
                    {p.is_active ? <span className="badge">Опубликован</span> : <span className="badge badge-muted">Черновик</span>}
                  </td>
                  <td>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmSubmit className="btn btn-danger btn-sm" message="Удалить товар без возможности восстановления?">Удалить</ConfirmSubmit>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
