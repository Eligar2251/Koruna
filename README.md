# РегионЛес

Сайт на Next.js. Страницы, тексты и стили те же: HTML отдаётся без изменений. Админка — React и TypeScript. Разделы и товары добавляются в админке и сразу появляются на страницах каталога.

## Сайт и админка

```bash
npm install
cp .env.example .env   # задать ADMIN_PASSWORD
npm run build
npm start              # http://localhost:3000
```

Админка: http://localhost:3000/admin

В карточке раздела поле «Страница сайта» связывает раздел с уже существующей страницей. Например, адрес `listovye-materialy` показывает товары на `/katalog/listovye-materialy.html`, `osb-3` — на странице ОСП-3. Общий список — на `/katalog.html`.

Если в `.env` заданы настоящие `SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY`, админка пишет в Supabase. Иначе товары сохраняются локально в `data/catalog.json` — это только предпросмотр, файл в git не попадает.

Фото без Supabase лежат в `uploads/`. С Supabase они уходят в бакет `product-images`.

## База Supabase

Миграции в `supabase/migrations/` применяются по порядку. Каждую можно вставить в SQL Editor и выполнить:

1. `20261017120000_clean_database.sql` — очищает всю схему `public` и политики приложения в Storage. Не удаляет файлы S3 и пользователей Authentication.
2. `20261017120100_catalog.sql` — разделы, товары, `admin_users`, бакет фото.

Повторно запускать очистку после наполнения каталога нельзя: она снова сотрёт разделы и товары.

Ручная очистка с подтверждением, включая файлы Storage через API: `npm run clean:dry`, затем `npm run clean -- --yes`. Описание флагов — в выводе `--help`.

Администратора Supabase Auth, если вход на сайт будет напрямую через Supabase, добавляют так:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'admin@example.ru';
```

Сервер сайта ходит в базу ключом service role и этот шаг для `/admin` не требует.

## Проверка

```bash
npm test
```
