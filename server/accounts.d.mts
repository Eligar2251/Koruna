export function signJwt(payload: Record<string, unknown>, ttlSeconds: number): string
export function verifyJwt(token: string): Record<string, unknown> | null
export function passwordKey(password: string): Promise<string>
export function passwordMatches(password: string, key: string): Promise<boolean>
export function signAccess(account: { id: string; email: string }): string
export function readAccess(token: string): { sub: string; email?: string } | null

export type AccountBook = {
  list(): Promise<Array<{ id: string; email: string; name: string; created_at: string }>>
  byId(id: string): Promise<{ id: string; email: string; name: string; password_key: string } | null>
  create(body: { email: string; name: string; password: string }): Promise<{ id: string; email: string; name: string; created_at: string }>
  authenticate(email: string, password: string): Promise<{ id: string; email: string; name: string } | null>
}

export function createAccountBook(file: string): AccountBook
