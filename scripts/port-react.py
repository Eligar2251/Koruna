#!/usr/bin/env python3
"""Convert site/*.html into React pages. The visual stays in each page's design folder."""

from __future__ import annotations

import json
import posixpath
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
PAGES = ROOT / 'components' / 'pages'

VOID = {
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
    'param', 'source', 'track', 'wbr',
}
PHRASING = {'span', 'a', 'button', 'label', 'em', 'strong', 'b', 'i', 'small', 'time'}
BLOCK = {
    'div', 'p', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section',
    'header', 'footer', 'form', 'table', 'article', 'nav', 'figure', 'blockquote',
}
SVG_ATTRS = {
    'viewbox': 'viewBox',
    'preserveaspectratio': 'preserveAspectRatio',
    'gradientunits': 'gradientUnits',
    'gradienttransform': 'gradientTransform',
    'patternunits': 'patternUnits',
    'clippathunits': 'clipPathUnits',
    'stddeviation': 'stdDeviation',
    'attributename': 'attributeName',
    'repeatcount': 'repeatCount',
    'keypoints': 'keyPoints',
    'keytimes': 'keyTimes',
    'keysplines': 'keySplines',
}
SPECIAL = {
    'class': 'className',
    'for': 'htmlFor',
    'tabindex': 'tabIndex',
    'maxlength': 'maxLength',
    'readonly': 'readOnly',
    'autocomplete': 'autoComplete',
    'autofocus': 'autoFocus',
    'colspan': 'colSpan',
    'rowspan': 'rowSpan',
    'srcset': 'srcSet',
    'crossorigin': 'crossOrigin',
    'fetchpriority': 'fetchPriority',
    'novalidate': 'noValidate',
    'contenteditable': 'contentEditable',
    'datetime': 'dateTime',
    'hreflang': 'hrefLang',
    'usemap': 'useMap',
}
SKIP_CSS = ('tilda-animation', '/assets/catalog.css', 'catalog.css')
EXTRA_CSS = """
.koruna-nolink { cursor: default; }
.t-animate,
.t-animate[data-animate-style] {
  opacity: 1 !important;
  transform: none !important;
  filter: none !important;
}
#t-header { height: 68px; }
@media screen and (max-width: 960px) {
  #t-header { height: 64px; }
}
.t396__artboard[data-artboard-upscale="window"] > .csb-scale {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
@media screen and (min-width: 1200px) {
  .t396__artboard[data-artboard-upscale="window"] {
    height: calc(var(--csb-h) * var(--csb-scale, 1)) !important;
  }
  .t396__artboard[data-artboard-upscale="window"] > .csb-scale {
    width: 1200px;
    height: var(--csb-h);
    left: 50%;
    top: 0;
    right: auto;
    bottom: auto;
    transform: translateX(-50%) scale(var(--csb-scale, 1));
    transform-origin: top center;
  }
}
#rec2050530551 .t-menu-base__logowrapper,
#rec2050530551 .t-menu-base__logo {
  width: auto !important;
  max-width: none !important;
}
"""


def green(value: str) -> str:
    value = re.sub(r'#2f5491', '#1C6B5A', value, flags=re.I)
    value = re.sub(r'rgb\(\s*47\s*,\s*84\s*,\s*145\s*\)', 'rgb(28, 107, 90)', value, flags=re.I)
    value = re.sub(r'rgba\(\s*47\s*,\s*84\s*,\s*145\s*,', 'rgba(28, 107, 90,', value, flags=re.I)
    return value


def brand_text(value: str) -> str:
    return re.sub(r'Регион[Лл]ес', 'ЦСБ', value)


def page_base(rel: str) -> str:
    parent = str(Path(rel).parent).replace('\\', '/')
    return '' if parent == '.' else parent


def resolve_path(url: str, rel: str) -> str:
    path = url.split('#', 1)[0].split('?', 1)[0]
    if path.startswith('/'):
        resolved = path
    else:
        resolved = posixpath.normpath(posixpath.join(page_base(rel), path))
    return '/' + resolved.lstrip('/')


def rewrite_href(url: str, rel: str) -> str:
    url = url.strip()
    if not url or url.startswith(('mailto:', 'tel:')):
        return url
    if url.startswith('#'):
        if url == '#opencart':
            return '/korzina'
        if url == '#opensearch':
            return '/katalog'
        return url
    if url.startswith(('javascript:', 'http://', 'https://', '//')):
        return '#'
    frag = ''
    if '#' in url:
        frag = url[url.index('#'):]
    path = url.split('#', 1)[0].split('?', 1)[0]
    if path.startswith('/'):
        resolved = path.lstrip('/')
    else:
        resolved = posixpath.normpath(posixpath.join(page_base(rel), path)) if path else page_base(rel)
    if resolved in ('', '.', 'index.html'):
        route = '/'
    elif resolved.endswith('/index.html'):
        route = '/' + resolved[: -len('/index.html')]
    elif resolved.endswith('.html'):
        route = '/' + resolved[:-5]
    else:
        route = '/' + resolved
    route = posixpath.normpath(route)
    if not route.startswith('/'):
        route = '/' + route
    if route == '/index':
        route = '/'
    return route + frag


def rewrite_css_urls(value: str, rel: str) -> str:
    def repl(match: re.Match[str]) -> str:
        raw = match.group(1).strip().strip('\'"')
        if not raw or raw.startswith(('data:', 'http:', 'https:', '/')):
            return f'url("{raw}")'
        return f'url("{resolve_path(raw, rel)}")'

    return re.sub(r'url\(([^)]+)\)', repl, value)


def react_name(name: str) -> str | None:
    lower = name.lower()
    if lower.startswith('on') and lower not in ('on',):
        return None
    if lower.startswith(('data-field-', 'data-tilda-')) or lower in ('imgfield', 'data-hook'):
        return None
    if lower in SVG_ATTRS:
        return SVG_ATTRS[lower]
    if lower in SPECIAL:
        return SPECIAL[lower]
    if lower.startswith(('data-', 'aria-')):
        return lower
    if ':' in lower:
        left, right = lower.split(':', 1)
        return left + right[:1].upper() + right[1:]
    parts = lower.split('-')
    if len(parts) == 1:
        return lower
    return parts[0] + ''.join(part.capitalize() for part in parts[1:])


class Builder(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root: list = []
        self.stack = [self.root]

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        node = {'tag': tag, 'attrs': merge_attrs(attrs), 'children': []}
        self.stack[-1].append(node)
        if tag not in VOID:
            self.stack.append(node['children'])

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.stack[-1].append({'tag': tag, 'attrs': merge_attrs(attrs), 'children': []})

    def handle_endtag(self, tag: str) -> None:
        if tag in VOID:
            return
        if len(self.stack) > 1:
            self.stack.pop()

    def handle_data(self, data: str) -> None:
        if data:
            self.stack[-1].append(data)


def merge_attrs(attrs: list[tuple[str, str | None]]) -> dict[str, str]:
    merged: dict[str, str] = {}
    for key, value in attrs:
        name = key.lower()
        text = '' if value is None else value
        if name == 'class' and name in merged:
            merged[name] = f'{merged[name]} {text}'.strip()
        else:
            merged[name] = text
    return merged


def parse_body(html: str) -> list:
    match = re.search(r'<body[^>]*>(.*)</body>', html, flags=re.S | re.I)
    body = match.group(1) if match else html
    body = re.sub(r'<script\b[^>]*>.*?</script>', '', body, flags=re.S | re.I)
    body = re.sub(r'<style\b[^>]*>.*?</style>', '', body, flags=re.S | re.I)
    body = re.sub(r'<link\b[^>]*>', '', body, flags=re.I)
    body = re.sub(r'<!--.*?-->', '', body, flags=re.S)
    parser = Builder()
    parser.feed(body)
    parser.close()
    return parser.root


def text_of(node) -> str:
    if isinstance(node, str):
        return node
    if node.get('component'):
        return ''
    return ''.join(text_of(child) for child in node.get('children', []))


def is_logo(node) -> bool:
    return isinstance(node, dict) and node.get('tag') == 'img' and 't-menu-base__imglogo' in node['attrs'].get('class', '')


def meaningful(children: list) -> list:
    return [child for child in children if not (isinstance(child, str) and not child.strip())]


def catalog_meta(node) -> tuple[str, str]:
    if isinstance(node, str) or node.get('component'):
        return '', ''
    attrs = node.get('attrs', {})
    if attrs.get('id') == 'koruna-catalog':
        return attrs.get('data-mode', 'all'), attrs.get('data-slug', '')
    for child in node.get('children', []):
        mode, slug = catalog_meta(child)
        if mode:
            return mode, slug
    return '', ''


def normalize_text(value: str) -> str:
    if not value.strip():
        return ''
    lead = ' ' if value[0].isspace() else ''
    trail = ' ' if value[-1].isspace() else ''
    return lead + re.sub(r'\s+', ' ', value.strip()) + trail


def transform(node, rel: str):
    if isinstance(node, str):
        text = normalize_text(brand_text(node))
        return text or None
    attrs = node['attrs']
    classes = attrs.get('class', '')
    if 't-tildalabel' in classes or attrs.get('id') == 'tildacopy':
        return None
    if attrs.get('id') == 'rec-koruna-catalog':
        mode, slug = catalog_meta(node)
        if mode == 'home':
            return None
        node['children'] = [{'component': 'CatalogFill', 'mode': mode or 'all', 'slug': slug}]
    elif 't396__elem' in classes and 'Получить оптовую' in text_of(node):
        return None
    elif node['tag'] == 'a' and len(meaningful(node['children'])) == 1 and is_logo(meaningful(node['children'])[0]):
        return {'component': 'Brand'}
    elif is_logo(node):
        return {'component': 'Brand'}
    elif 't-menu-burger' in classes:
        return {'component': 'MenuButton'}
    elif 'js-carticon-counter' in classes:
        return {'component': 'CartCount'}
    else:
        node['children'] = [child for child in (transform(child, rel) for child in node['children']) if child is not None]
        if 't396__artboard' in classes:
            classes = add_class(classes, 'rendered')
            attrs['class'] = classes
            if attrs.get('data-artboard-upscale') == 'window':
                node['children'] = [{'tag': 'div', 'attrs': {'class': 'csb-scale'}, 'children': node['children']}]
    rewrite_node_attrs(node, rel)
    return node


def add_class(value: str, name: str) -> str:
    parts = value.split()
    if name not in parts:
        parts.append(name)
    return ' '.join(parts)


COLOR_ATTRS = {'fill', 'stroke', 'color', 'stop-color', 'flood-color'}


def rewrite_node_attrs(node, rel: str) -> None:
    if node.get('component'):
        return
    attrs = node['attrs']
    if 'href' in attrs:
        attrs['href'] = rewrite_href(attrs['href'], rel)
    for key in ('src', 'poster'):
        if key in attrs and attrs[key] and not attrs[key].startswith(('data:', 'http:', 'https:', '/', '#')):
            attrs[key] = resolve_path(attrs[key], rel)
    drop = []
    for key, value in list(attrs.items()):
        if key in COLOR_ATTRS:
            attrs[key] = green(value)
        if key.startswith('xmlns'):
            continue
        if value.startswith(('http://', 'https://', '//')):
            drop.append(key)
    for key in drop:
        attrs.pop(key, None)
    if 'style' in attrs:
        attrs['style'] = green(rewrite_css_urls(attrs['style'], rel))
    for child in node.get('children', []):
        if isinstance(child, dict):
            rewrite_node_attrs(child, rel)


def has_block(node) -> bool:
    if isinstance(node, str):
        return False
    if node.get('component'):
        return True
    if node.get('tag') in BLOCK:
        return True
    return any(has_block(child) for child in node.get('children', []))


def contains_link(node) -> bool:
    if isinstance(node, str):
        return False
    if node.get('component') == 'Brand' or node.get('tag') == 'a':
        return True
    return any(contains_link(child) for child in node.get('children', []))


def fix_nesting(node) -> None:
    if isinstance(node, str) or node.get('component'):
        return
    for child in node.get('children', []):
        fix_nesting(child)
    if node['tag'] in PHRASING and node['tag'] != 'a' and any(has_block(child) for child in node['children']):
        node['tag'] = 'div'
    if node['tag'] == 'p' and any(has_block(child) for child in node['children']):
        node['tag'] = 'div'
    if node['tag'] == 'a' and any(contains_link(child) for child in node['children']):
        node['tag'] = 'div'
        node['attrs'].pop('href', None)


def style_jsx(value: str) -> str | None:
    parts = []
    for decl in value.split(';'):
        if ':' not in decl:
            continue
        key, raw = decl.split(':', 1)
        key = key.strip()
        raw = raw.strip()
        if not key or not raw:
            continue
        name = react_name(key) or key
        if name.startswith('--'):
            parts.append(f'[{json.dumps(name)}]: {json.dumps(raw)}')
        else:
            parts.append(f'{name}: {json.dumps(raw)}')
    if not parts:
        return None
    return '{{' + ', '.join(parts) + '}}'


def emit(node, indent: int) -> str:
    pad = '  ' * indent
    if isinstance(node, str):
        return f'{pad}{{{json.dumps(node)}}}'
    if node.get('component') == 'CatalogFill':
        return f'{pad}<CatalogFill mode={json.dumps(node["mode"])} slug={json.dumps(node["slug"])} />'
    if node.get('component'):
        return f'{pad}<{node["component"]} />'
    tag = node['tag']
    input_type = node['attrs'].get('type', '').lower()
    attrs = []
    for key, value in node['attrs'].items():
        name = react_name(key)
        if not name or key == 'style':
            continue
        if key in ('src', 'href', 'poster') and value.startswith(('http://', 'https://', '//')):
            continue
        if name == 'value' and (tag in ('textarea', 'select') or (tag == 'input' and input_type not in ('checkbox', 'radio', 'button', 'submit', 'reset', 'file', 'image'))):
            name = 'defaultValue'
        if name == 'checked' and tag == 'input':
            name = 'defaultChecked'
        attrs.append(f'{name}={{{json.dumps(value)}}}')
    if 'style' in node['attrs']:
        style = style_jsx(node['attrs']['style'])
        if style:
            attrs.append(f'style={style}')
    attr_text = (' ' + ' '.join(attrs)) if attrs else ''
    children = node['children']
    if tag in VOID or not children:
        return f'{pad}<{tag}{attr_text} />'
    inner = '\n'.join(emit(child, indent + 1) for child in children)
    return f'{pad}<{tag}{attr_text}>\n{inner}\n{pad}</{tag}>'


def stylesheet_links(html: str, rel: str) -> list[str]:
    links = []
    for tag in re.findall(r'<link\b[^>]*>', html, flags=re.I):
        if not re.search(r'rel=["\']stylesheet["\']', tag, flags=re.I):
            continue
        href = re.search(r'href=["\']([^"\']+)', tag)
        if not href:
            continue
        url = href.group(1)
        if any(skip in url for skip in SKIP_CSS):
            continue
        if url.startswith(('http://', 'https://', '//')):
            continue
        links.append(resolve_path(url, rel))
    seen = []
    for link in links:
        if link not in seen:
            seen.append(link)
    return seen


def sanitize_css(css: str) -> str:
    # Tilda export cuts this declaration before the closing parenthesis.
    return css.replace("var(--t-text-font,'Inter';", 'var(--t-text-font, Arial);')


def extracted_css(html: str, rel: str) -> str:
    chunks = []
    for chunk in re.findall(r'<style[^>]*>(.*?)</style>', html, flags=re.S | re.I):
        chunks.append(sanitize_css(green(rewrite_css_urls(chunk, rel))))
    heights = []
    for tag in re.findall(r'<div[^>]*class="[^"]*t396__artboard[^"]*"[^>]*>', html):
        if 'data-artboard-upscale="window"' not in tag:
            continue
        rec = re.search(r'data-artboard-recid="(\d+)"', tag)
        height = re.search(r'data-artboard-height="(\d+)"', tag)
        if rec and height:
            heights.append(f'#rec{rec.group(1)} .t396__artboard {{ --csb-h: {height.group(1)}px; }}')
    return '\n'.join(chunks + heights) + '\n' + EXTRA_CSS


def title_of(html: str) -> str:
    match = re.search(r'<title>(.*?)</title>', html, flags=re.S | re.I)
    title = brand_text(re.sub(r'\s+', ' ', match.group(1)).strip()) if match else 'ЦСБ'
    if title in ('ЦСБ', 'РегионЛес'):
        return 'ЦСБ — Центральная Строительная База'
    return title


def component_name(key: str) -> str:
    if not key:
        return 'HomePage'
    parts = re.sub(r'[^0-9a-zA-Z]+', ' ', key).title().replace(' ', '')
    if parts and parts[0].isdigit():
        parts = 'Page' + parts
    return f'{parts}Page'


def route_key(rel: str) -> str:
    if rel == 'index.html':
        return ''
    stem = rel[:-5]
    if stem.endswith('/index'):
        stem = stem[:-len('/index')]
    return stem


def lookup_key(rel: str) -> str:
    key = route_key(rel)
    if key == 'katalog':
        return ''
    if key.startswith('katalog/'):
        return key[len('katalog/'):]
    return key


def find_tag(nodes: list, tag: str):
    for node in nodes:
        if isinstance(node, dict) and node.get('tag') == tag:
            return node
        if isinstance(node, dict):
            found = find_tag(node.get('children', []), tag)
            if found:
                return found
    return None


def used_components(node, found: set[str]) -> None:
    if isinstance(node, str):
        return
    if node.get('component'):
        found.add(node['component'])
    for child in node.get('children', []):
        used_components(child, found)


def write_page(rel: str, html: str) -> dict:
    key = route_key(rel)
    name = component_name(key if rel != 'index.html' else '')
    if rel == 'index.html':
        folder = PAGES / 'home'
        name = 'HomePage'
    elif rel == 'katalog.html':
        folder = PAGES / 'katalog'
        name = 'KatalogPage'
    else:
        folder = PAGES / Path(route_key(rel))
        name = component_name(route_key(rel).split('/')[-1] if route_key(rel) else 'page')
    folder.mkdir(parents=True, exist_ok=True)
    design = folder / 'design'
    design.mkdir(exist_ok=True)
    (design / 'page.css').write_text(extracted_css(html, rel), encoding='utf-8')
    nodes = [node for node in (transform(node, rel) for node in parse_body(html)) if node is not None]
    for node in nodes:
        if isinstance(node, dict):
            fix_nesting(node)
    found: set[str] = set()
    for node in nodes:
        used_components(node, found)
    depth = len(folder.relative_to(ROOT / 'components').parts)
    prefix = '/'.join(['..'] * depth)
    imports = ["import './design/page.css'"]
    if 'Brand' in found:
        imports.append(f"import {{ Brand }} from '{prefix}/brand/Brand'")
    if 'MenuButton' in found:
        imports.append(f"import {{ MenuButton }} from '{prefix}/chrome/MenuButton'")
    if 'CartCount' in found:
        imports.append(f"import {{ CartCount }} from '{prefix}/cart/CartCount'")
    if 'CatalogFill' in found:
        imports.append(f"import {{ CatalogFill }} from '{prefix}/catalog/CatalogFill'")
    links = '\n'.join(
        f'      <link rel="stylesheet" href={json.dumps(href)} />' for href in stylesheet_links(html, rel)
    )
    body = '\n'.join(emit(node, 3) for node in nodes)
    source = (
        '\n'.join(imports)
        + f'\n\nexport function {name}() {{\n  return (\n    <>\n{links}\n{body}\n    </>\n  )\n}}\n'
    )
    (folder / f'{name}.jsx').write_text(source, encoding='utf-8')
    return {
        'rel': rel,
        'key': '' if rel == 'index.html' else route_key(rel),
        'name': name,
        'import_path': str((folder / name).relative_to(ROOT / 'components')).replace('\\', '/'),
        'title': title_of(html),
        'catalog': rel.startswith('katalog'),
    }


def write_chrome(home_html: str) -> None:
    nodes = [node for node in (transform(node, 'index.html') for node in parse_body(home_html)) if node is not None]
    for node in nodes:
        if isinstance(node, dict):
            fix_nesting(node)
    header = find_tag(nodes, 'header')
    footer = find_tag(nodes, 'footer')
    if not header or not footer:
        raise SystemExit('header or footer missing')
    chrome = ROOT / 'components' / 'chrome'
    chrome.mkdir(exist_ok=True)
    for tag, node in (('Header', header), ('Footer', footer)):
        found: set[str] = set()
        used_components(node, found)
        imports = ["import '../pages/home/design/page.css'"]
        if 'Brand' in found:
            imports.append("import { Brand } from '../brand/Brand'")
        if 'MenuButton' in found:
            imports.append("import { MenuButton } from './MenuButton'")
        if 'CartCount' in found:
            imports.append("import { CartCount } from '../cart/CartCount'")
        body = emit(node, 2)
        if tag == 'Header':
            imports.append("import { SiteStyles } from './SiteStyles'")
            body = '    <>\n      <SiteStyles />\n' + body + '\n    </>'
        (chrome / f'{tag}.jsx').write_text(
            '\n'.join(imports) + f'\n\nexport function {tag}() {{\n  return (\n{body}\n  )\n}}\n',
            encoding='utf-8',
        )


def write_routes(pages: list[dict]) -> None:
    catalog = [page for page in pages if page['catalog']]
    others = [page for page in pages if not page['catalog'] and page['rel'] != 'index.html']
    home = next(page for page in pages if page['rel'] == 'index.html')
    lines = []
    entries = []
    titles = []
    for page in catalog:
        alias = re.sub(r'[^0-9a-zA-Z]+', '_', page['key'] or 'root')
        lines.append(f"import {{ {page['name']} as {alias} }} from './{page['import_path'].split('pages/')[-1]}'")
        entries.append(f"  {json.dumps(lookup_key(page['rel']))}: {alias},")
        titles.append(f"  {json.dumps(lookup_key(page['rel']))}: {json.dumps(page['title'])},")
    registry = (
        '\n'.join(lines)
        + '\n\nexport const catalogPages = {\n'
        + '\n'.join(entries)
        + '\n}\n\nexport const catalogTitles = {\n'
        + '\n'.join(titles)
        + '\n}\n'
    )
    (PAGES / 'registry.js').write_text(registry, encoding='utf-8')
    (ROOT / 'app' / 'page.tsx').write_text(
        "import type { Metadata } from 'next'\n"
        f"import {{ {home['name']} }} from '../components/pages/home/{home['name']}'\n\n"
        "export const metadata: Metadata = {\n"
        f"  title: {json.dumps(home['title'])},\n"
        "}\n\n"
        f"export default function Page() {{\n  return <{home['name']} />\n}}\n",
        encoding='utf-8',
    )
    catalog_route = ROOT / 'app' / 'katalog' / '[[...slug]]'
    catalog_route.mkdir(parents=True, exist_ok=True)
    (catalog_route / 'page.tsx').write_text(
        """import type { ReactElement } from 'react'
import type { Metadata } from 'next'
import { CatalogOnly } from '../../../components/catalog/CatalogOnly'
import { catalogPages, catalogTitles } from '../../../components/pages/registry'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug?: string[] }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params
  const key = slug.join('/')
  const titles = catalogTitles as Record<string, string>
  return { title: titles[key] || 'Каталог — ЦСБ' }
}

export default async function Page({ params }: Props) {
  const { slug = [] } = await params
  const key = slug.join('/')
  const pages = catalogPages as Record<string, () => ReactElement>
  const Found = pages[key]
  if (Found) return <Found />
  return <CatalogOnly slug={slug.at(-1) || ''} />
}
""",
        encoding='utf-8',
    )
    for page in others:
        route = ROOT / 'app' / page['key']
        route.mkdir(parents=True, exist_ok=True)
        depth = len(Path(page['key']).parts)
        import_path = '../' * (depth + 1) + f"components/{page['import_path']}"
        (route / 'page.tsx').write_text(
            "import type { Metadata } from 'next'\n"
            f"import {{ {page['name']} }} from '{import_path}'\n\n"
            "export const metadata: Metadata = {\n"
            f"  title: {json.dumps(page['title'])},\n"
            "}\n\n"
            f"export default function Page() {{\n  return <{page['name']} />\n}}\n",
            encoding='utf-8',
        )


def main() -> None:
    pages = []
    htmls = sorted(SITE.rglob('*.html'))
    preferred: dict[str, str] = {}
    for path in htmls:
        rel = path.relative_to(SITE).as_posix()
        key = 'home' if rel == 'index.html' else 'page:' + lookup_key(rel)
        current = preferred.get(key)
        if current is None or (current.endswith('/index.html') and not rel.endswith('/index.html')):
            preferred[key] = rel
    home_html = (SITE / 'index.html').read_text(encoding='utf-8')
    for path in htmls:
        rel = path.relative_to(SITE).as_posix()
        ident = 'home' if rel == 'index.html' else 'page:' + lookup_key(rel)
        if preferred.get(ident) != rel:
            print('skip', rel)
            continue
        pages.append(write_page(rel, path.read_text(encoding='utf-8')))
        print(rel, pages[-1]['name'])
    write_chrome(home_html)
    write_routes(pages)
    import runpy
    runpy.run_path(str(ROOT / 'scripts' / 'enhance-react.py'), run_name='__main__')
    print(f'pages {len(pages)}')


if __name__ == '__main__':
    main()
