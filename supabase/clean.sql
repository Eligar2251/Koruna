-- Очистка прикладной схемы public в Supabase.
-- Идемпотентно: повторный запуск на уже пустой базе ничего не ломает.
--
-- Не удаляет файлы Storage. DELETE по storage.objects стирает только метаданные,
-- объекты в S3 остаются и продолжают тарифицироваться. На новых проектах такой
-- DELETE ещё и запрещён триггером. Файлы удаляет scripts/clean-db.mjs через Storage API
-- либо вручную: Dashboard → Storage → бакет product-images → Empty, затем Delete.
--
-- Не удаляет пользователей Authentication. Это делает скрипт с флагом --with-auth
-- или раскомментированный блок ниже, если запускаете файл вручную.
--
-- Запуск вручную: Supabase → SQL Editor → New query → вставить файл целиком → Run.
-- Нужна роль postgres, не anon.

begin;

set local lock_timeout = '15s';
set local statement_timeout = '120s';
set local search_path = public;

-- postgres и так обходит RLS. Если роль позволяет, выключаем и FORCE RLS, чтобы count(*) показал все строки.
do $$
begin
  perform set_config('row_security', 'off', true);
exception
  when insufficient_privilege then
    null;
end $$;

create temp table _clean_log (
  step serial primary key,
  action text not null,
  object text not null
) on commit drop;

-- Сколько строк было в таблицах public до удаления.
do $$
declare
  r record;
  n bigint;
begin
  for r in
    select tablename as name
    from pg_tables
    where schemaname = 'public'
    order by 1
  loop
    execute 'select count(*) from public.' || quote_ident(r.name) into n;
    insert into _clean_log (action, object)
    values ('rows', 'public.' || r.name || ' (' || n || ')');
  end loop;
end $$;

-- Снять таблицы public с публикаций, чтобы DROP TABLE не упёрся в realtime.
do $$
declare
  r record;
begin
  if to_regclass('pg_catalog.pg_publication_tables') is null then
    return;
  end if;

  for r in
    select pubname, schemaname, tablename
    from pg_publication_tables
    where schemaname = 'public'
  loop
    execute format(
      'alter publication %I drop table %I.%I',
      r.pubname,
      r.schemaname,
      r.tablename
    );
    insert into _clean_log (action, object)
    values ('publication', r.pubname || ' drop ' || r.schemaname || '.' || r.tablename);
  end loop;
end $$;

-- Политики Storage, которые создавал магазин или которые вызывают функции public.
-- Сами объекты бакета здесь не удаляются.
do $$
declare
  pol record;
begin
  if to_regclass('pg_catalog.pg_policies') is null then
    return;
  end if;

  for pol in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'storage'
      and (
        policyname in (
          'product_images_public_read',
          'product_images_admin_insert',
          'product_images_admin_update',
          'product_images_admin_delete'
        )
        or policyname like 'product_images_%'
        or coalesce(qual, '') ilike '%product-images%'
        or coalesce(with_check, '') ilike '%product-images%'
        or coalesce(qual, '') ~* 'is_admin[[:space:]]*\('
        or coalesce(with_check, '') ~* 'is_admin[[:space:]]*\('
      )
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      pol.policyname,
      pol.schemaname,
      pol.tablename
    );
    insert into _clean_log (action, object)
    values ('drop policy', pol.schemaname || '.' || pol.tablename || '.' || pol.policyname);
  end loop;
end $$;

-- Представления, таблицы, последовательности, функции и типы в public.
-- Объекты расширений не трогаем. Служебные схемы Supabase (auth, storage, extensions) не удаляются.
do $$
declare
  r record;
begin
  for r in
    select viewname as name
    from pg_views
    where schemaname = 'public'
    order by 1
  loop
    execute 'drop view if exists public.' || quote_ident(r.name) || ' cascade';
    insert into _clean_log (action, object) values ('drop view', 'public.' || r.name);
  end loop;

  for r in
    select matviewname as name
    from pg_matviews
    where schemaname = 'public'
    order by 1
  loop
    execute 'drop materialized view if exists public.' || quote_ident(r.name) || ' cascade';
    insert into _clean_log (action, object) values ('drop materialized view', 'public.' || r.name);
  end loop;

  for r in
    select tablename as name
    from pg_tables
    where schemaname = 'public'
    order by 1
  loop
    execute 'drop table if exists public.' || quote_ident(r.name) || ' cascade';
    insert into _clean_log (action, object) values ('drop table', 'public.' || r.name);
  end loop;

  for r in
    select c.relname as name
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'f'
    order by 1
  loop
    execute 'drop foreign table if exists public.' || quote_ident(r.name) || ' cascade';
    insert into _clean_log (action, object) values ('drop foreign table', 'public.' || r.name);
  end loop;

  for r in
    select sequencename as name
    from pg_sequences
    where schemaname = 'public'
    order by 1
  loop
    execute 'drop sequence if exists public.' || quote_ident(r.name) || ' cascade';
    insert into _clean_log (action, object) values ('drop sequence', 'public.' || r.name);
  end loop;

  for r in
    select
      p.proname as name,
      pg_get_function_identity_arguments(p.oid) as args
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and not exists (
        select 1
        from pg_depend d
        where d.classid = 'pg_proc'::regclass
          and d.objid = p.oid
          and d.deptype = 'e'
      )
    order by 1
  loop
    if exists (
      select 1
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public'
        and p.proname = r.name
        and pg_get_function_identity_arguments(p.oid) = r.args
    ) then
      execute 'drop routine if exists public.'
        || quote_ident(r.name)
        || '(' || r.args || ') cascade';
      insert into _clean_log (action, object)
      values ('drop routine', 'public.' || r.name || '(' || r.args || ')');
    end if;
  end loop;

  for r in
    select t.typname as name, t.typtype
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
      and t.typtype in ('d', 'c', 'e')
      and not exists (
        select 1
        from pg_depend d
        where d.classid = 'pg_type'::regclass
          and d.objid = t.oid
          and d.deptype = 'e'
      )
    order by case t.typtype when 'd' then 0 when 'c' then 1 else 2 end, t.typname
  loop
    if r.typtype = 'd' then
      execute 'drop domain if exists public.' || quote_ident(r.name) || ' cascade';
      insert into _clean_log (action, object) values ('drop domain', 'public.' || r.name);
    elsif to_regtype(format('%I.%I', 'public', r.name)) is not null then
      execute 'drop type if exists public.' || quote_ident(r.name) || ' cascade';
      insert into _clean_log (action, object) values ('drop type', 'public.' || r.name);
    end if;
  end loop;
end $$;

-- История миграций CLI. Если магазин накатывался через SQL Editor, таблица пустая или её нет.
-- Если этот блок мешает, запускайте скрипт с --keep-migrations.
-- __MIGRATIONS_START__
do $$
declare
  r record;
  n bigint;
begin
  if not exists (select 1 from pg_namespace where nspname = 'supabase_migrations') then
    return;
  end if;

  for r in
    select tablename as name
    from pg_tables
    where schemaname = 'supabase_migrations'
    order by 1
  loop
    execute 'delete from supabase_migrations.' || quote_ident(r.name);
    get diagnostics n = row_count;
    insert into _clean_log (action, object)
    values ('delete', 'supabase_migrations.' || r.name || ' (' || n || ' rows)');
  end loop;
end $$;
-- __MIGRATIONS_END__

-- Сюда скрипт подставляет --with-auth и --all-storage. В SQL Editor строка — просто комментарий.
-- __OPTIONAL_SQL__

-- Чтобы удалить пользователей Authentication вручную, уберите комментарий со следующей строки.
-- delete from auth.users;

do $$
declare
  n bigint;
begin
  if to_regclass('storage.objects') is null then
    return;
  end if;

  execute $count$
    select count(*) from storage.objects where bucket_id = 'product-images'
  $count$ into n;

  insert into _clean_log (action, object)
  values (
    'storage left',
    'product-images metadata rows: ' || n || ' (файлы удаляет только Storage API)'
  );
end $$;

select step, action, object
from _clean_log
order by step;

commit;
