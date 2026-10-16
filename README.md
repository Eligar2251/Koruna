# Очистка базы Supabase

Репозиторий содержит только очистку базы проекта Koruna. Кода магазина здесь больше нет.

Скрипт необратимо удаляет данные. Сначала смотрите план (`--dry-run`), затем запускайте с `--yes`.

## Что удаляется

По умолчанию:

- всё в схеме `public`: таблицы, представления, функции, типы, последовательности;
- политики Storage, которые относятся к бакету `product-images` или вызывают `is_admin()`;
- сам бакет `product-images` и файлы в нём — через Storage API, чтобы объекты удалились и из S3;
- история в `supabase_migrations`, если эта схема есть.

Раньше магазин хранил здесь `admin_users`, `categories`, `products`, `leads`, типы `lead_type` и `lead_status`, функции `is_admin()` и `set_updated_at()`, фото в `product-images/products/`. Скрипт не ищет их по именам: он очищает всю схему `public`.

Не удаляется без отдельного флага:

- пользователи Authentication (`--with-auth`);
- другие бакеты (`--all-storage`);
- сам проект Supabase, схемы `auth`, `storage`, `extensions` и объекты расширений.

SQL намеренно не делает `delete from storage.objects`. Такой запрос оставляет файлы в S3, и они продолжают тарифицироваться. На новых проектах он ещё и запрещён триггером.

## Запуск

```bash
npm install
cp .env.example .env
```

В `.env`:

| Переменная | Откуда |
| --- | --- |
| `DATABASE_URL` | Project Settings → Database → Connection string → URI. Direct connection или Session pooler, порт **5432**. |
| `SUPABASE_URL` | Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` / secret |

Порт `6543` (transaction pooler) не подходит: скрипт выполняет DDL. Если хост `db.<ref>.supabase.co` не открывается, у проекта часто нет IPv4 на прямом подключении — возьмите Session pooler, порт 5432. Пароль со спецсимволами нужно percent-encode (`@` → `%40`).

```bash
npm run clean:dry
npm run clean -- --yes
```

Другие режимы:

```bash
npm run clean -- --yes --with-auth
npm run clean -- --yes --all-storage --with-auth
npm run clean -- --schema-only --yes
npm run clean -- --storage-only --yes
npm run clean -- --yes --keep-migrations
```

`CONFIRM=wipe` работает как `--yes`. Без `--yes` скрипт ничего не меняет.

Ключ `service_role` обходит RLS. Не коммитьте `.env` и не подставляйте anon-ключ.

## Только SQL Editor

Если нет возможности запустить скрипт, схему можно очистить вручную:

1. Dashboard → Storage → бакет `product-images` → Empty, затем Delete.
2. SQL Editor → вставить [`supabase/clean.sql`](supabase/clean.sql) целиком → Run.

Файл идемпотентен. Пользователей он не удаляет: строка `delete from auth.users` внизу закомментирована.

Большие бакеты (больше 200 000 объектов) Dashboard может не очистить. Тогда, по [документации Storage](https://supabase.com/docs/guides/storage/management/delete-objects), синхронизируйте бакет с пустой папкой через S3-протокол: `aws s3 sync empty-dir/ s3://product-images --delete`.

## Проверка

```bash
npm test
```

Тест поднимает локальный Postgres, создаёт таблицы магазина и проверяет, что очистка опустошает `public`, не удаляет файл из `storage.objects` через SQL и не задевает чужую схему.

Если SQL Editor пишет, что транзакция прервана, выполните `rollback;` и запустите файл ещё раз.
