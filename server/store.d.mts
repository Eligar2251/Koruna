export interface CatalogStore {
  mode: 'file' | 'supabase'
  bulkProducts(updates: unknown): Promise<{ updated: number }>
  stockMovements(): Promise<unknown[]>
  adjustStock(id: string, input: Record<string, unknown>): Promise<unknown>
  catalog(): Promise<{ categories: unknown[]; products: unknown[] }>
  adminList(): Promise<{ categories: unknown[]; products: unknown[] }>
  saveCategory(input: Record<string, unknown>, id?: string): Promise<unknown>
  deleteCategory(id: string): Promise<unknown>
  saveProduct(input: Record<string, unknown>, id?: string): Promise<unknown>
  deleteProduct(id: string): Promise<unknown>
}

export function slugify(value: string): string
export function createFileStore(file: string): CatalogStore
export function createSupabaseStore(client: unknown): CatalogStore
