import { CategoryForm } from '@/components/admin/category-form'
import { getAdminCategories } from '@/lib/data'

export const metadata = { title: 'Разделы — админка' }

export default async function CategoriesPage() {
  const categories = await getAdminCategories()
  return (
    <>
      <div className="admin-top">
        <h1>Разделы каталога</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 820 }}>
        {categories.map((c) => (
          <CategoryForm key={c.id} category={c} />
        ))}
        <h2 style={{ fontSize: '1.1rem', marginTop: 12 }}>Новый раздел</h2>
        <CategoryForm />
      </div>
    </>
  )
}
