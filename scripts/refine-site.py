"""Keep shared navigation, original photos and company layout after JSX regeneration."""
from pathlib import Path
import json, os, re
ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / 'components/pages'
# Only full-size photographs already present in main, never generated substitutes.
FULL = {
 'tild3136-': '/_static.tildacdn.com/tild3266-3963-4065-b938-346265633761/112970.jpg',
 'tild3462-': '/_static.tildacdn.com/tild3532-6563-4430-a538-316633373164/photo_2026-02-27_14-.jpg',
 'tild3562-': '/_static.tildacdn.com/tild3532-6563-4430-a538-316633373164/photo_2026-02-27_14-.jpg',
 'tild3736-': '/_static.tildacdn.com/tild3934-3634-4536-b466-646266333234/photo_2026-03-19_15-.jpg',
 'tild3830-': '/_static.tildacdn.com/tild3934-3634-4536-b466-646266333234/photo_2026-03-19_15-.jpg',
 'tild3835-': '/_static.tildacdn.com/tild6131-3064-4064-b533-383966343536/photo_2026-02-27_14-.jpg',
 'tild6230-': '/_static.tildacdn.com/tild3865-6265-4036-a461-636362393633/photo_2026-02-27_14-.jpg',
 'tild6561-': '/_static.tildacdn.com/tild6131-3064-4064-b533-383966343536/photo_2026-02-27_14-.jpg',
 'tild6661-': '/_static.tildacdn.com/tild3934-3634-4536-b466-646266333234/photo_2026-03-19_15-.jpg',
}
for p in list(PAGES.rglob('*.jsx')) + list((ROOT/'components/chrome').glob('*.jsx')):
 s=p.read_text()
 if p.parent.name != 'chrome':
  s=re.sub(r'\s*<header id=\{"t-header"\}.*?</header>', '', s, flags=re.S)
 if p.name == 'Header.jsx':
  marker='                    <div className={"t-menu__link-wrapper"} data-menu-submenu-hook={"link_sub2_2050530551"}'
  if marker in s:
   a=s.rfind('                  <li',0,s.index(marker));b=s.index('\n                  </li>',a)+len('\n                  </li>')
   s=s[:a]+'                  <CatalogMenu categories={categories} />'+s[b:]
  if "from './CatalogMenu'" not in s: s="import { CatalogMenu } from './CatalogMenu'\n"+s
  if 'export function Header()' in s:
   s=s.replace('export function Header()',"/** @param {{ categories?: import('../../lib/catalog').CatalogCategory[] }} props */\nexport function Header({categories=[]})")
 if p.name=='OKompaniiPage.jsx':
  if 'id={"rec2093234441"}' in s:
   a=s.index('        <div id={"rec2093234441"}');b=s.index('\n        <footer',a);s=s[:a]+'        <CompanyVideos />\n'+s[b:]
  if "from './CompanyVideos'" not in s:s="import { CompanyVideos } from './CompanyVideos'\n"+s
  def background(m):
   src=json.loads(m[2])[4:-1].strip('"')
   return '<SiteBackground'+m[1]+'original={'+json.dumps(src)+'} style={{height: "60vh"}}'
  s=re.sub(r'<SiteBackground([^>]*?)style=\{\{backgroundImage: ("(?:[^"\\]|\\.)*"), height: "60vh"\}\}',background,s)
 # The home hero calculation CTA is one semantic button, not four overlaid shapes.
 if '1773127887314000001' in s and '<CalculationButton' not in s and re.search(r'<div className=\{"t396__elem[^>]+data-elem-id=\{"1773127887314000001"\}[^>]*>\s*<InquiryButton[^>]+/>',s):
  for elem in ['1773127887314000002','1773127887314000003','1773127887314000004']:
   match=re.search(r'<div className=\{"t396__elem[^>]+data-elem-id=\{"'+elem+r'"\}[^>]*>',s)
   if match:
    depth=1
    for token in re.finditer(r'<div\b[^>]*>|</div>',s[match.end():]):
     if token[0]=='</div>':depth-=1
     elif not token[0].endswith('/>'):depth+=1
     if depth==0:s=s[:match.start()]+s[match.end()+token.end():];break
  match=re.search(r'(<div className=\{"t396__elem[^>]+data-elem-id=\{"1773127887314000001"\}[^>]*>)\s*<InquiryButton[^>]+/>',s)
  if not match:raise RuntimeError('Missing hero calculation button')
  s=s[:match.start()]+match[1]+'<CalculationButton />'+s[match.end():]
  rel=os.path.relpath(ROOT/'components/site/CalculationButton',p.parent).replace('\\','/')
  if not rel.startswith('.'):rel='./'+rel
  s=f"import {{ CalculationButton }} from '{rel}'\n"+s
 # Keep the materials CTA in normal layout flow instead of separate absolute shapes.
 if 'id="3ce55672405b"' in s:
  position=s.index('id="3ce55672405b"')
  records=list(re.finditer(r'<div id=\{"rec[0-9]+"\}[^>]*data-record-type=\{"396"\}[^>]*>',s[:position]))
  if records:
   record=records[-1]; depth=1; end=None
   for token in re.finditer(r'<div\b[^>]*>|</div>',s[record.end():]):
    if token[0]=='</div>':depth-=1
    elif not token[0].endswith('/>'):depth+=1
    if depth==0:end=record.end()+token.end();break
   if end is None:raise RuntimeError('Unbalanced materials CTA')
   s=s[:record.start()]+'<MaterialsCallout />'+s[end:]
   rel=os.path.relpath(ROOT/'components/site/MaterialsCallout',p.parent).replace('\\','/')
   if not rel.startswith('.'):rel='./'+rel
   s=f"import {{ MaterialsCallout }} from '{rel}'\n"+s
 s=re.sub(r'\s*<link rel="stylesheet" href="/_fonts\.googleapis\.com/[^"\s]+" />','',s)
 # Internal links are framework links; telephone, email and external media remain distinct.
 stack=[];edits=[]
 for t in re.finditer(r'<a\b[^>]*>|</a>',s):
  if t[0]=='</a>':
   if stack and stack.pop():edits.append((t.start(),t.end(),'</NavLink>'))
  else:
   yes=bool(re.search(r'href=\{"/[^"}]*"\}',t[0]))
   if yes:edits.append((t.start(),t.end(),t[0].replace('<a','<NavLink',1)))
   if not t[0].endswith('/>'):stack.append(yes)
 for a,b,value in reversed(edits):s=s[:a]+value+s[b:]
 if '<NavLink' in s and 'import { NavLink }' not in s:
  rel=os.path.relpath(ROOT/'components/chrome/NavLink',p.parent).replace('\\','/');rel=rel if rel.startswith('.') else './'+rel;s=f"import {{ NavLink }} from '{rel}'\n"+s
 # Header-only imports no longer belong in individual pages.
 if p.parent.name != 'chrome':
  s=re.sub(r"import \{ (?:Brand|MenuButton|CartCount) \} from [^\n]+\n",'',s)
 s=re.sub(r"[ \t]+(?=\n)","",s)
 p.write_text(s)
media_path=ROOT/'components/site/media.json';media=json.loads(media_path.read_text())
for key,entry in media.items():
 if key.startswith('/_thb.'):
  entry['src']=next((value for prefix,value in FULL.items() if prefix in key),key)
media_path.write_text(json.dumps(media,ensure_ascii=False,indent=2)+'\n')
