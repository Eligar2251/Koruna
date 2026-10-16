export function seedFileStore(store: {
  saveCategory(input: Record<string, unknown>): Promise<unknown>
  saveProduct(input: Record<string, unknown>): Promise<unknown>
}): Promise<void>
