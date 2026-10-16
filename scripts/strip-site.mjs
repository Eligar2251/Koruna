import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const htmlRoot = existsSync(path.join(root, 'site')) ? path.join(root, 'site') : root
const ASSET_SNIPPET = `
<link rel="stylesheet" href="/assets/catalog.css">
<script src="/assets/catalog.js" defer></script>
`

export function stripExternalAnchors(html) {
  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (full, attrs, inner) => {
    const href = attrs.match(/\bhref\s*=\s*(["'])([\s\S]*?)\1/i)
    if (!href || !/^https?:\/\//i.test(href[2].trim())) return full
    const cleaned = attrs.replace(/\s*\bhref\s*=\s*(["'])[\s\S]*?\1/i, '')
    return `<span class="koruna-nolink"${cleaned}>${inner}</span>`
  })
}

export function stripExternalHeadLinks(html) {
  return html.replace(/<link\b[^>]*>/gi, (tag) => {
    if (!/https?:\/\//i.test(tag)) return tag
    if (/rel\s*=\s*(["'])(?:dns-prefetch|preconnect)\1/i.test(tag)) return ''
    return tag
  })
}

export function stripRemoteWidgets(html) {
  return html.replace(
    /<script\b[^>]*\bsrc\s*=\s*(["'])[^"']*(?:tilda-forms|tilda-cart|tilda-catalog|tilda-products)[^"']*\1[^>]*>\s*<\/script>/gi,
    '',
  )
}

export function pageSlug(relativePath) {
  const norm = relativePath.replaceAll('\\', '/')
  if (norm === 'index.html') return { mode: 'home', slug: '' }
  if (norm === 'katalog.html') return { mode: 'all', slug: '' }
  const match = norm.match(/^katalog\/(.+)\.html$/)
  if (!match) return null
  let slug = match[1]
  if (slug.endsWith('/index')) slug = slug.slice(0, -'/index'.length)
  if (slug.includes('/')) slug = slug.split('/').pop()
  return { mode: 'category', slug }
}

export function catalogMount(mode, slug) {
  const title = mode === 'home' ? 'Каталог' : 'Товары'
  return `<div id="rec-koruna-catalog" class="r t-rec koruna-rec" data-record-type="koruna">
<div id="koruna-catalog" class="koruna-catalog" data-mode="${mode}" data-slug="${slug}">
<p class="koruna-catalog__state">${title}</p>
</div>
</div>
`
}

export function replaceProductRecords(html, mount) {
  const marker = '<div id="rec'
  let cursor = 0
  let result = ''
  let replaced = false
  while (cursor < html.length) {
    const start = html.indexOf(marker, cursor)
    if (start === -1) {
      result += html.slice(cursor)
      break
    }
    result += html.slice(cursor, start)
    const next = html.indexOf(marker, start + marker.length)
    const end = next === -1 ? html.length : next
    const block = html.slice(start, end)
    if (/data-record-type="2421"/.test(block)) {
      if (!replaced) result += mount
      replaced = true
    } else {
      result += block
    }
    cursor = end
  }
  return { html: result, replaced }
}

export function injectAssets(html) {
  if (html.includes('/assets/catalog.js')) return html
  if (html.includes('</body>')) return html.replace('</body>', `${ASSET_SNIPPET}</body>`)
  return `${html}\n${ASSET_SNIPPET}`
}

export function transformHtml(html, relativePath) {
  let next = stripExternalHeadLinks(stripRemoteWidgets(stripExternalAnchors(html)))
  const page = pageSlug(relativePath)
  if (!page) return injectAssets(next)
  const mount = catalogMount(page.mode, page.slug)
  if (page.mode === 'category') {
    const replaced = replaceProductRecords(next, mount)
    next = replaced.html
    if (!replaced.replaced && !next.includes('id="koruna-catalog"')) {
      next = next.replace('</footer>', `${mount}</footer>`)
    }
  } else if (!next.includes('id="koruna-catalog"')) {
    if (next.includes('<footer ')) next = next.replace('<footer ', `${mount}<footer `)
    else if (next.includes('</footer>')) next = next.replace('</footer>', `${mount}</footer>`)
    else next = next.replace('<!--/footer-->', `${mount}<!--/footer-->`)
  }
  return injectAssets(next)
}

function htmlFiles(dir, prefix = '') {
  const found = []
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === 'node_modules' || name === 'admin') continue
    const absolute = path.join(dir, name)
    const relative = prefix ? `${prefix}/${name}` : name
    if (statSync(absolute).isDirectory()) found.push(...htmlFiles(absolute, relative))
    else if (name.endsWith('.html')) found.push(relative)
  }
  return found
}

function isDirectRun() {
  const entry = process.argv[1]
  if (!entry) return false
  return import.meta.url === pathToFileURL(entry).href
}

import { pathToFileURL } from 'node:url'

if (isDirectRun()) {
  const files = htmlFiles(htmlRoot)
  for (const relative of files) {
    const absolute = path.join(htmlRoot, relative)
    const source = readFileSync(absolute, 'utf8')
    const next = transformHtml(source, relative)
    if (next !== source) writeFileSync(absolute, next)
    const leftover = [...next.matchAll(/\bhref\s*=\s*(["'])(https?:\/\/[^"']+)\1/gi)].map((item) => item[2])
    if (leftover.length) {
      console.error(`${relative}: остались внешние ссылки: ${leftover.slice(0, 5).join(', ')}`)
      process.exitCode = 1
    } else {
      console.log(relative)
    }
  }
}
