import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile,readdir}from'node:fs/promises'
import path from 'node:path'
const root=new URL('../',import.meta.url)
async function files(dir){const out=[];for(const entry of await readdir(new URL(dir,root),{withFileTypes:true})){const file=path.posix.join(dir,entry.name);if(entry.isDirectory())out.push(...await files(file));else out.push(file)}return out}

test('фото каталога совпадают с исходными фотографиями экспорта, не с заменами',async()=>{
 const originalFiles=(await files('public/_static.tildacdn.com')).filter(f=>/\.(jpe?g|png)$/i.test(f))
 const originals=await Promise.all(originalFiles.map(f=>readFile(new URL(f,root))))
 for(const f of await files('public/assets/catalog')){const photo=await readFile(new URL(f,root));assert.ok(originals.some(original=>original.equals(photo)),f)}
 const media=JSON.parse(await readFile(new URL('components/site/media.json',root),'utf8'))
 for(const [key,value]of Object.entries(media)){if(key.startsWith('/_thb.')){assert.ok(value.src.startsWith('/_static.tildacdn.com/'));await readFile(new URL('public'+value.src,root))}}
})

test('общая шапка живёт в layout; страницы не добавляют вторую шапку и внутренние ссылки не перезагружают документ',async()=>{
 const layout=await readFile(new URL('app/layout.tsx',root),'utf8');assert.match(layout,/<PublicHeader><Header/)
 for(const f of(await files('components/pages')).filter(f=>f.endsWith('.jsx'))){const source=await readFile(new URL(f,root),'utf8');assert.doesNotMatch(source,/<header id=\{"t-header"\}/,f);assert.doesNotMatch(source,/<a\b[^>]*href=\{"\//,f)}
 const nav=await readFile(new URL('components/chrome/NavLink.tsx',root),'utf8');assert.match(nav,/from "next\/link"|from 'next\/link'/);assert.match(nav,/router\.prefetch/)
})

test('видео не загружаются автоматически и не возвращают старые заголовки',async()=>{
 const page=await readFile(new URL('components/pages/o-kompanii/OKompaniiPage.jsx',root),'utf8');assert.doesNotMatch(page,/t1061__blockname|t-video-no-lazyload/)
 const video=await readFile(new URL('components/pages/o-kompanii/CompanyVideos.tsx',root),'utf8');assert.match(video,/active\.includes\(id\)/);assert.match(video,/setActive/);assert.match(video,/loading="lazy"/)
})

test('блок расчёта общий: фото и кнопка находятся в потоке, без абсолютных фигур Tilda',async()=>{
 const callout=await readFile(new URL('components/site/MaterialsCallout.tsx',root),'utf8')
 assert.match(callout,/csb-materials-callout__image/)
 assert.match(callout,/InquiryButton/)
 const css=await readFile(new URL('components/site/design/materials-callout.css',root),'utf8')
 assert.match(css,/display:\s*grid/)
 assert.doesNotMatch(css,/position:\s*absolute/)
 for(const f of(await files('components/pages')).filter(f=>f.endsWith('.jsx'))){
  const page=await readFile(new URL(f,root),'utf8')
  assert.doesNotMatch(page,/<SiteText id="3ce55672405b"/,f)
 }
})

test('фильтры вынесены в боковую колонку с выдвижной панелью на мобильных',async()=>{
 const source=await readFile(new URL('components/catalog/ProductGrid.tsx',root),'utf8')
 assert.match(source,/<aside/)
 assert.match(source,/koruna-products-results/)
 assert.match(source,/aria-modal/)
 assert.match(source,/event.key === ["']Escape["']/)
 const css=await readFile(new URL('components/catalog/design/catalog.css',root),'utf8')
 assert.match(css,/grid-template-columns:\s*240px minmax\(0,\s*1fr\)/)
 assert.match(css,/\.koruna-filter-sidebar\.is-open/)
})
