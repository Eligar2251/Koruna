from pathlib import Path
import re,json,hashlib,os
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'components/site/media.json').read_text()) if (ROOT/'components/site/media.json').exists() else {}
content=json.loads((ROOT/'components/site/content.json').read_text()) if (ROOT/'components/site/content.json').exists() else {}
field_values={
 'ЦСБ':'short','Центральная Строительная База':'full','info@reg-les.ru':'email',
 '+7 961 222 03 05':'phone1','+7 961 222-03-05':'phone1','+7 383 255 55 99':'phone2','+7 383 255-55-99':'phone2',
 'ИП Абрамов М.Г.':'legalFull','ИП Абрамов Михаил Геннадьевич':'legalFull','540528687285':'inn','316547600180079':'ogrn','40802810513230002151':'account','044525411':'bik',
 'г. Новосибирск, ул. Писемского 4к1':'address','Пн–Пт: 9:00–18:00':'officeHours',
}
# Remove obsolete hidden Tilda widgets rather than leave non-working forms and cookie buttons.
def remove_widgets(s):
 while True:
  m=re.search(r'<div\b[^>]*data-record-type=\{"(?:706|886|985)"\}[^>]*>',s)
  if not m:break
  depth=1; end=m.end()
  for t in re.finditer(r'<div\b[^>]*>|</div>',s[m.end():]):
   if t[0].startswith('</'):depth-=1
   elif not t[0].endswith('/>'):depth+=1
   if depth==0:end=m.end()+t.end();break
  else:raise RuntimeError('widget parse')
  s=s[:m.start()]+s[end:]
 return s

def replace_spans(s):
 # Balance spans, replacing their matching closing tags (including nested SVG/text).
 tokens=list(re.finditer(r'<span\b[^>]*>|</span>',s)); stack=[];edits=[]
 for t in tokens:
  if t[0].startswith('</'):
   if not stack:continue
   op,replace=stack.pop()
   if replace: edits.append((t.start(),t.end(),'</InquiryButton>'))
  else:
   replace='koruna-nolink' in t[0]
   if replace: edits.append((t.start(),t.end(),t[0].replace('<span','<InquiryButton',1)))
   if not t[0].endswith('/>'):stack.append((t,replace))
 for a,b,text in reversed(edits):s=s[:a]+text+s[b:]
 return s
for p in list((ROOT/'components/pages').rglob('*.jsx'))+list((ROOT/'components/chrome').glob('*.jsx')):
 s=p.read_text()
 if 'from ' in s and '/SiteProvider' in s:continue
 s=remove_widgets(s);s=replace_spans(s)
 s=s.replace('href={""}', 'href={"/katalog"}')
 # Nonexistent example categories should lead to their real parent catalogue.
 for bad in ['/katalog/mejkomnatnye-dvery','/katalog/krovelnye-materialy/armature','/katalog/krovelnye-materialy/smesi','/katalog/krovelnye-materialy/gidroshchita']:
  s=s.replace(json.dumps(bad), json.dumps('/katalog/krovelnye-materialy' if '/krovelnye' in bad else '/katalog'))
 s=s.replace('href={"/katalog/krovelnye-materialy/proflist"}', 'href={"/katalog/krovelnye-materialy"}')
 # All text content can be edited; contacts and legal data use dedicated fields.
 def text(m):
  v=json.loads(m[2]);field=field_values.get(v.strip())
  if not v.strip() or v.strip() in ('>', '.', 'OK'):return m[0]
  if not field and 'Писемского' in v:field='address'
  if not field and v.strip().startswith(('ФИЛИАЛ «ЦЕНТРАЛЬНЫЙ»','ФИЛИАЛ "ЦЕНТРАЛЬНЫЙ"')):field='bank'
  key=hashlib.sha256(v.encode()).hexdigest()[:12];content[key]=v
  attrs=f'field="{field}"' if field else f'id="{key}"'
  return m[1]+f'<SiteText {attrs} fallback={{{json.dumps(v)}}} />'+m[3]
 s=re.sub(r'(^[ \t]*)\{("(?:[^"\\]|\\.)*")\}([ \t]*$)',text,s,flags=re.M)
 # Contact anchors have a React implementation, not DOM mutations.
 links=list(re.finditer(r'<a\b[^>]*href=\{("(?:[^"\\]|\\.)*")\}[^>]*>|</a>',s));stack=[];edits=[]
 for t in links:
  if t[0].startswith('</'):
   if stack:
    flag=stack.pop()
    if flag:edits.append((t.start(),t.end(),'</SiteLink>'))
  else:
   href=json.loads(t[1]);field='email' if href.startswith('mailto:') else ('phone2' if '7383' in href else 'phone1') if href.startswith('tel:') else None
   stack.append(field)
   if field:edits.append((t.start(),t.end(),t[0].replace('<a','<SiteLink',1).replace('href={'+t[1]+'}',f'field="{field}"')))
 for a,b,v in reversed(edits):s=s[:a]+v+s[b:]
 # Media registry defaults are all local. Replace tiny placeholders with local full-size assets.
 def media_src(src):
  if '/_thb.' not in src:return src
  if 'tild3462-' in src:return '/assets/catalog/sheets.jpg'
  if 'tild6661-' in src:return '/assets/catalog/gypsum.jpg'
  return '/assets/catalog/sheets.jpg'
 def img(m):
  tag=m[0];srcm=re.search(r'src=\{("(?:[^"\\]|\\.)*")\}',tag)
  if not srcm:return tag
  src=json.loads(srcm[1]);manifest[src]={'src':media_src(src),'label':p.parent.name+' · '+Path(src).name}
  return tag.replace('<img','<SiteImage',1)
 s=re.sub(r'<img\b[^>]*>',img,s)
 def bg(m):
  tag=m[0];sm=re.search(r'backgroundImage: ("(?:[^"\\]|\\.)*")',tag)
  if not sm:return tag
  src=json.loads(sm[1])[4:-1].strip('"');manifest[src]={'src':media_src(src),'label':p.parent.name+' · фон · '+Path(src).name}
  # exported background atoms are self-closing
  if not tag.endswith('/>'):raise RuntimeError('background not self closing')
  return tag.replace('<div','<SiteBackground',1).replace('style={{'+sm[0]+'}}', 'original={'+json.dumps(src)+'}')
 s=re.sub(r'<div\b[^>]*style=\{\{backgroundImage:[^>]*>',bg,s)
 imports=[]
 for name in ['SiteText','SiteLink','InquiryButton']:
  if '<'+name in s:imports.append(name)
 prefix=os.path.relpath(ROOT/'components/site',p.parent).replace('\\','/')
 if not prefix.startswith('.'):prefix='./'+prefix
 if imports:s=f"import {{ {', '.join(imports)} }} from '{prefix}/SiteProvider'\n"+s
 imgs=[name for name in ['SiteImage','SiteBackground'] if '<'+name in s]
 if imgs:s=f"import {{ {', '.join(imgs)} }} from '{prefix}/SiteImage'\n"+s
 p.write_text(s)

# Keep image-links configurable too; contact and legal fields must never retain old values.
for p in list((ROOT/'components/pages').rglob('*.jsx'))+list((ROOT/'components/chrome').glob('*.jsx')):
 s=p.read_text()
 def bg_link(m):
  tag=m[0];sm=re.search(r'backgroundImage: ("(?:[^"\\]|\\.)*")',tag)
  src=json.loads(sm[1])[4:-1].strip('"')
  target='/assets/catalog/profiles.jpg' if 'tild3136-' in src else '/assets/catalog/sheets.jpg' if '/_thb.' in src else src
  manifest[src]={'src':target,'label':'Каталог · фон · '+Path(src).name}
  return tag.replace('<a','<SiteBackgroundLink',1).replace('style={{'+sm[0]+'}}','original={'+json.dumps(src)+'}')
 s=re.sub(r'<a\b[^>]*style=\{\{backgroundImage:[^>]*>',bg_link,s)
 if '<SiteBackgroundLink' in s and not re.search(r'import \{[^}]*SiteBackgroundLink',s):s=s.replace('import { SiteImage','import { SiteBackgroundLink, SiteImage',1)
 def dynamic_text(m):
  tag=m[0];v=json.loads(m[1]);numbers={'540528687285':'inn','316547600180079':'ogrn','40802810513230002151':'account','044525411':'bik'}
  for number,field in numbers.items():
   if number in v and 'prefix=' not in tag:
    prefix,suffix=v.split(number,1)
    tag=re.sub(r'(?:id|field)="[^"]+"',lambda _: f'field="{field}" prefix={{{json.dumps(prefix)}}} suffix={{{json.dumps(suffix)}}}',tag,count=1);return tag
  digits=re.sub(r'\D','',v)
  field='phone1' if digits=='79612220305' else 'phone2' if digits=='73832555599' else 'officeHours' if v=='Пн-Пт с 9 до 18ч' else None
  if field:tag=re.sub(r'(?:id|field)="[^"]+"',f'field="{field}"',tag,count=1)
  return tag
 s=re.sub(r'<SiteText\b[^>]*fallback=\{("(?:[^"\\]|\\.)*")\}[^>]*/>',dynamic_text,s)
 s=re.sub(r'<SiteText field="officeHours"[^>]*/>\s*<br />\s*<SiteText id="68762a65bf91"[^>]*/>', '<SiteText field="warehouseHours" fallback={"Пн–Пт: 9:00–18:00, Сб–Вс: 9:00–15:00"} />',s)
 if re.search(r'<div className=\{"t-map"\}[^>]*/>',s):
  s=re.sub(r'<div className=\{"t-map"\}[^>]*/>','<ContactLocation />',s)
  s="import { ContactLocation } from '../../site/ContactLocation'\n"+s
 s=s.replace('aria-label={"Search"}', 'aria-label={"Поиск по каталогу"}').replace('aria-label={"Cart"}', 'aria-label={"Корзина"}')
 p.write_text('\n'.join(line.rstrip() for line in s.splitlines())+'\n')
used=set()
for p in list((ROOT/'components').rglob('*.jsx'))+list((ROOT/'components').rglob('*.tsx')):
 used.update(re.findall(r'<SiteText id="([^"]+)"',p.read_text()))
content={key:value for key,value in content.items() if key in used}
manifest['/assets/logo-mark.png']={'src':'/assets/logo-mark.png','label':'Логотип сайта'}
for p in (ROOT/'public/assets/catalog').glob('*.jpg'):
 src='/'+str(p.relative_to(ROOT/'public'));manifest[src]={'src':src,'label':'Категории · '+p.stem}
(ROOT/'components/site/media.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(ROOT/'components/site/content.json').write_text(json.dumps(content,ensure_ascii=False,indent=2)+'\n')
print('content',len(content),'media',len(manifest))

import runpy
runpy.run_path(str(ROOT / "scripts" / "refine-site.py"), run_name="__main__")
