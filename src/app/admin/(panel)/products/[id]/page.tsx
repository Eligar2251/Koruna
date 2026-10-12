import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/product-form'
import { getAdminCategories, getAdminProduct } from '@/lib/data'

export const metadata = { title: 'Редактирование товара — админка' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories] = await Promise.all([getAdminProduct(id), getAdminCategories()])
  if (!product) notFound()

  return (
    <>
      <div className="admin-top">
        <h1>{product.name}</h1>
      </div>
      <ProductForm product={product} categories={categories} />
    </>
  )
}
