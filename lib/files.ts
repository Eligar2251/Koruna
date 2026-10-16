import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

const siteDir = path.join(process.cwd(), 'site')
const uploadsDir = path.join(process.cwd(), 'uploads')

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function notFound() {
  return new NextResponse('Не найдено', {
    status: 404,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

function inside(root: string, file: string) {
  const resolved = path.resolve(file)
  return resolved === root || resolved.startsWith(root + path.sep)
}

async function resolveSite(urlPath: string) {
  let decoded = urlPath.split('?')[0] || '/'
  try {
    decoded = decodeURIComponent(decoded)
  } catch {
    return null
  }
  if (decoded.includes('\0') || decoded.includes('..')) return null
  const relative = decoded.replace(/^\/+/, '')
  const file = relative ? path.resolve(siteDir, relative) : path.join(siteDir, 'index.html')
  if (!inside(siteDir, file)) return null
  try {
    const info = await stat(file)
    if (info.isDirectory()) {
      const index = path.join(file, 'index.html')
      await stat(index)
      return index
    }
    return file
  } catch {
    if (!file.endsWith('.html')) {
      const html = `${file}.html`
      if (!inside(siteDir, html)) return null
      try {
        await stat(html)
        return html
      } catch {
        return null
      }
    }
    return null
  }
}

async function sendFile(file: string) {
  const data = await readFile(file)
  const ext = path.extname(file).toLowerCase()
  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      'content-type': MIME[ext] || 'application/octet-stream',
      'cache-control': 'no-store',
    },
  })
}

export async function serveSite(urlPath: string) {
  const file = await resolveSite(urlPath)
  if (!file) return notFound()
  try {
    return await sendFile(file)
  } catch {
    return notFound()
  }
}

export async function serveUpload(name: string) {
  const file = path.join(uploadsDir, path.basename(name))
  if (!inside(uploadsDir, file)) return notFound()
  try {
    const info = await stat(file)
    if (!info.isFile()) return notFound()
    return await sendFile(file)
  } catch {
    return notFound()
  }
}
