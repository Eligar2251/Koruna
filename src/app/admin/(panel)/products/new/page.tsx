import { ProductForm } from '@/components/admin/product-form'
import { getAdminCategories } from '@/lib/data'

export const metadata = { title: 'Новый товар — админка' }

export default async function NewProductPage() {
  const categories = await getAdminCategories()
  return (
    <>
      <div className="admin-top">
        <h1>Новый товар</h1>
      </div>
      <ProductForm categories={categories} />
    </>
  )
}
