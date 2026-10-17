import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (name) => readFile(path.join(root, name), 'utf8')

async function stylesIn(dir) {
  const files = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await stylesIn(name))
    else if (entry.name === 'page.css') files.push(name)
  }
  return files
}

test('пример окружения: БД только URL/anon, закрытая панель задаётся напрямую в env', async () => {
  const env = await read('.env.example')
  const enabled = [...env.matchAll(/^([A-Z_]+)=/gm)].map((match) => match[1])
  assert.deepEqual(enabled, ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'ADMIN_PATH', 'JWT_SECRET'])
  assert.match(env, /^ADMIN_PATH=$/m)
  assert.match(env, /^JWT_SECRET=$/m)
  assert.doesNotMatch(env, /DATABASE_URL|SUPABASE_DB_URL|ADMIN_PASSWORD/)
  // Runtime must not regain a service-role or direct-Postgres dependency.
  for (const file of ['lib/auth.ts', 'lib/server.ts']) {
    assert.doesNotMatch(await read(file), /process\.env\.(?:DATABASE_URL|SUPABASE_DB_URL|SUPABASE_SERVICE_ROLE_KEY)/)
  }
})

test('каждая страница и конвертер сохраняют ненулевую высоту десктопных блоков', async () => {
  const files = await stylesIn(path.join(root, 'components/pages'))
  assert.equal(files.length, 20)
  for (const file of [...files, path.join(root, 'scripts/port-react.py')]) {
    const css = await readFile(file, 'utf8')
    assert.doesNotMatch(css, /100vw\s*\/\s*1200/, file)
    assert.match(css, /height:\s*calc\(var\(--csb-h\)\s*\*\s*var\(--csb-scale,\s*1\)\)/, file)
    assert.match(css, /translateX\(-50%\)\s+scale\(var\(--csb-scale,\s*1\)\)/, file)
    if (file.endsWith('.css')) {
      assert.match(css, /--csb-h:\s*\d+px/, file)
    }
  }
  assert.match(await read('app/layout.tsx'), /<ViewportScale\s*\/>/)
  assert.match(await read('components/chrome/ViewportScale.tsx'), /window\.innerWidth\s*\/\s*1200/)
})
