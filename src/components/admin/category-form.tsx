'use client'

import { useActionState, useTransition } from 'react'
import { saveCategory, type CategoryFormState } from '@/actions/admin-categories'
import type { Category } from '@/lib/types'

export function CategoryForm({ category }: { category?: Category }) {
  const [state, formAction] = useActionState(saveCategory, {} as CategoryFormState)
  const [, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(() => formAction(fd))
  }

  const id = category?.id ?? 'new'

  return (
    <form onSubmit={onSubmit} className="card form" style={{ padding: 18 }}>
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <div className="grid-2">
        <div className="field">
          <label className="field-label" htmlFor={`name-${id}`}>Название</label>
          <input id={`name-${id}`} name="name" className="input" required defaultValue={category?.name ?? ''} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor={`slug-${id}`}>Адрес раздела</label>
          <input id={`slug-${id}`} name="slug" className="input" defaultValue={category?.slug ?? ''} placeholder="создаётся из названия" />
        </div>
      </div>
      <div className="field">
        <label className="field-label" htmlFor={`desc-${id}`}>Описание</label>
        <textarea id={`desc-${id}`} name="description" className="input" rows={2} defaultValue={category?.description ?? ''} />
      </div>
      <div className="grid-2" style={{ alignItems: 'end' }}>
        <div className="field">
          <label className="field-label" htmlFor={`sort-${id}`}>Порядок</label>
          <input id={`sort-${id}`} name="sortOrder" className="input" inputMode="numeric" defaultValue={category?.sort_order ?? 0} />
        </div>
        <label className="checkbox">
          <input type="checkbox" name="isActive" defaultChecked={category ? category.is_active : true} />
          Показывать на сайте
        </label>
      </div>
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
      {state.ok ? <p className="small" style={{ color: 'var(--ok)', margin: 0 }}>Сохранено</p> : null}
      <div>
        <button type="submit" className="btn btn-primary btn-sm">
          {category ? 'Сохранить' : 'Добавить раздел'}
        </button>
      </div>
    </form>
  )
}
