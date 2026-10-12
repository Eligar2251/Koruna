'use client'

import Link from 'next/link'
import { useActionState, useEffect, useState, useTransition } from 'react'
import { deleteProduct, saveProduct, type ProductFormState } from '@/actions/admin-products'
import type { Category, ProductWithCategory } from '@/lib/types'
import { ConfirmSubmit } from './confirm-submit'

type Props = {
  product?: ProductWithCategory
  categories: Category[]
}

const initial: ProductFormState = {}

export function ProductForm({ product, categories }: Props) {
  const [state, formAction] = useActionState(saveProduct, initial)
  const [, startTransition] = useTransition()
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const shownImage = preview ?? product?.image_url ?? null

  // Отправка вручную: поля не сбрасываются, если сервер вернул ошибку
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(() => formAction(fd))
  }

  return (
    <>
    <form onSubmit={onSubmit} className="admin-form-grid">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="imageUrl" value={product?.image_url ?? ''} />

      <div className="card form">
        <div className="field">
          <label className="field-label" htmlFor="name">Название</label>
          <input id="name" name="name" className="input" required defaultValue={product?.name ?? ''} />
        </div>

        <div className="grid-2">
          <div className="field">
            <label className="field-label" htmlFor="categoryId">Раздел</label>
            <select id="categoryId" name="categoryId" className="input" defaultValue={product?.category_id ?? ''}>
              <option value="">Без раздела</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.is_active ? '' : ' (скрыт)'}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="sku">Артикул</label>
            <input id="sku" name="sku" className="input" defaultValue={product?.sku ?? ''} />
          </div>
        </div>

        <div className="grid-2">
          <div className="field">
            <label className="field-label" htmlFor="price">Цена, ₽</label>
            <input id="price" name="price" className="input" inputMode="decimal" defaultValue={product?.price ?? ''} placeholder="Пусто — «Цена по запросу»" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="unit">Единица</label>
            <input id="unit" name="unit" className="input" defaultValue={product?.unit ?? 'шт'} required />
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="description">Описание</label>
          <textarea id="description" name="description" className="input" rows={8} defaultValue={product?.description ?? ''} />
        </div>
      </div>

      <div className="admin-side">
        <div className="card form">
          <div className="field">
            <label className="field-label" htmlFor="slug">Адрес страницы</label>
            <input id="slug" name="slug" className="input" defaultValue={product?.slug ?? ''} placeholder="создаётся из названия" />
            <span className="field-hint">Латиница, цифры и дефис</span>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="sortOrder">Порядок сортировки</label>
            <input id="sortOrder" name="sortOrder" className="input" inputMode="numeric" defaultValue={product?.sort_order ?? 0} />
          </div>

          <label className="checkbox">
            <input type="checkbox" name="inStock" defaultChecked={product ? product.in_stock : true} />
            В наличии
          </label>
          <label className="checkbox">
            <input type="checkbox" name="isActive" defaultChecked={product ? product.is_active : true} />
            Опубликован на сайте
          </label>
        </div>

        <div className="card form">
          <span className="field-label">Фото</span>
          {shownImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shownImage} alt="" className="preview" />
          ) : (
            <div className="preview" aria-hidden="true" />
          )}
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            className="input"
            onChange={(e) => {
              const file = e.target.files?.[0]
              setPreview(file ? URL.createObjectURL(file) : null)
            }}
          />
          <span className="field-hint">JPG, PNG или WebP, до 5 МБ</span>
        </div>

        {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}

        <div className="form" style={{ gap: 10 }}>
          <button type="submit" className="btn btn-primary btn-block">
            {product ? 'Сохранить' : 'Создать товар'}
          </button>
          <Link href="/admin/products" className="btn btn-ghost btn-block">
            Отмена
          </Link>
        </div>

      </div>
    </form>

    {product ? (
      <form action={deleteProduct} style={{ marginTop: 20, maxWidth: 340 }}>
        <input type="hidden" name="id" value={product.id} />
        <ConfirmSubmit className="btn btn-danger btn-block" message="Удалить товар без возможности восстановления?">
          Удалить товар
        </ConfirmSubmit>
      </form>
    ) : null}
    </>
  )
}
