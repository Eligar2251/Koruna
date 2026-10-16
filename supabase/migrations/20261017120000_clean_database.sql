-- Очистка всей прикладной базы перед новой схемой каталога.
-- Идемпотентно. Служебные схемы Supabase (auth, storage, extensions) не удаляются.
-- Файлы Storage через SQL не стираются: иначе объекты остаются в S3.
-- Пользователи Authentication не удаляются. Для этого есть scripts/clean-db.mjs --with-auth.
--
-- Применять первой. Следующий файл создаёт разделы и товары.

do $clean$
declare
  r record;
begin
  if to_regclass('pg_catalog.pg_publication_tables') is not null then
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
    end loop;
  end if;

  if to_regclass('pg_catalog.pg_policies') is not null then
    for r in
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
        r.policyname,
        r.schemaname,
        r.tablename
      );
    end loop;
  end if;

  for r in
    select viewname as name
    from pg_views
    where schemaname = 'public'
    order by 1
  loop
    execute 'drop view if exists public.' || quote_ident(r.name) || ' cascade';
  end loop;

  for r in
    select matviewname as name
    from pg_matviews
    where schemaname = 'public'
    order by 1
  loop
    execute 'drop materialized view if exists public.' || quote_ident(r.name) || ' cascade';
  end loop;

  for r in
    select tablename as name
    from pg_tables
    where schemaname = 'public'
    order by 1
  loop
    execute 'drop table if exists public.' || quote_ident(r.name) || ' cascade';
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
  end loop;

  for r in
    select sequencename as name
    from pg_sequences
    where schemaname = 'public'
    order by 1
  loop
    execute 'drop sequence if exists public.' || quote_ident(r.name) || ' cascade';
  end loop;

  for r in
    select p.proname as name, pg_get_function_identity_arguments(p.oid) as args
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
        || quote_ident(r.name) || '(' || r.args || ') cascade';
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
    elsif to_regtype(format('%I.%I', 'public', r.name)) is not null then
      execute 'drop type if exists public.' || quote_ident(r.name) || ' cascade';
    end if;
  end loop;
end
$clean$;
