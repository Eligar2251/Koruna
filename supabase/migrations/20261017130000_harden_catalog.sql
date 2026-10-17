-- Закрывает пути, которыми анонимный ключ или чужой JWT могли бы прочитать
-- или изменить каталог. Пароли здесь не хранятся: их принимает только Supabase Auth.
-- Применять после 20261017120100_catalog.sql.

create or replace function public.current_user_id()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid;
begin
  -- Только auth.uid() из проверенного JWT. request.jwt.claim.sub можно
  -- подставить при прямом SQL, поэтому он больше не используется.
  begin
    execute 'select auth.uid()' into uid;
  exception
    when others then
      uid := null;
  end;
  return uid;
end;
$$;

create or replace function public.is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid uuid;
begin
  uid := public.current_user_id();
  if uid is null then
    return false;
  end if;
  return exists (
    select 1 from public.admin_users a
    where a.user_id = uid
  );
end;
$$;

revoke all on function public.current_user_id() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.set_updated_at() from public, anon, authenticated;
grant execute on function public.current_user_id() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.categories force row level security;
alter table public.products force row level security;
alter table public.admin_users force row level security;

revoke all on table public.categories from public, anon, authenticated;
revoke all on table public.products from public, anon, authenticated;
revoke all on table public.admin_users from public, anon, authenticated;

grant select on public.categories, public.products to anon, authenticated;
grant insert, update, delete on public.categories, public.products to authenticated;
grant select on public.admin_users to authenticated;

drop policy if exists categories_public_read on public.categories;
drop policy if exists categories_admin_insert on public.categories;
drop policy if exists categories_admin_update on public.categories;
drop policy if exists categories_admin_delete on public.categories;
drop policy if exists products_public_read on public.products;
drop policy if exists products_admin_insert on public.products;
drop policy if exists products_admin_update on public.products;
drop policy if exists products_admin_delete on public.products;
drop policy if exists admin_users_self_read on public.admin_users;
drop policy if exists admin_users_insert on public.admin_users;
drop policy if exists admin_users_update on public.admin_users;
drop policy if exists admin_users_delete on public.admin_users;

create policy categories_public_read on public.categories
for select to anon, authenticated
using (is_active or (select public.is_admin()));

create policy categories_admin_insert on public.categories
for insert to authenticated
with check ((select public.is_admin()));

create policy categories_admin_update on public.categories
for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy categories_admin_delete on public.categories
for delete to authenticated
using ((select public.is_admin()));

create policy products_public_read on public.products
for select to anon, authenticated
using (is_active or (select public.is_admin()));

create policy products_admin_insert on public.products
for insert to authenticated
with check ((select public.is_admin()));

create policy products_admin_update on public.products
for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy products_admin_delete on public.products
for delete to authenticated
using ((select public.is_admin()));

-- Свою строку можно увидеть, чтобы проверить вход. Вставить себя в админы нельзя:
-- политики на запись нет, и права insert/update/delete отозваны.
create policy admin_users_self_read on public.admin_users
for select to authenticated
using (user_id = (select public.current_user_id()));

alter default privileges in schema public revoke all on tables from public, anon, authenticated;
alter default privileges in schema public revoke all on functions from public, anon, authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products'
    ) then
      alter publication supabase_realtime drop table public.products;
    end if;
    if exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'categories'
    ) then
      alter publication supabase_realtime drop table public.categories;
    end if;
    if exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'admin_users'
    ) then
      alter publication supabase_realtime drop table public.admin_users;
    end if;
  end if;
exception
  when others then
    null;
end $$;

do $$
begin
  if to_regclass('auth.users') is not null then
    execute 'revoke all on table auth.users from public, anon, authenticated';
  end if;
exception
  when others then
    null;
end $$;

do $$
begin
  if to_regclass('storage.objects') is null then
    return;
  end if;

  execute 'drop policy if exists product_images_public_read on storage.objects';
  execute 'drop policy if exists product_images_admin_read on storage.objects';
  execute 'drop policy if exists product_images_admin_insert on storage.objects';
  execute 'drop policy if exists product_images_admin_update on storage.objects';
  execute 'drop policy if exists product_images_admin_delete on storage.objects';

  -- Публичный URL файла остаётся рабочим, но список объектов бакета anon не получает.
  execute $policy$
    create policy product_images_admin_read on storage.objects
    for select to authenticated
    using (bucket_id = 'product-images' and (select public.is_admin()))
  $policy$;
  execute $policy$
    create policy product_images_admin_insert on storage.objects
    for insert to authenticated
    with check (
      bucket_id = 'product-images'
      and (select public.is_admin())
      and name ~ '^[a-f0-9]{32}\.(jpg|png|webp)$'
    )
  $policy$;
  execute $policy$
    create policy product_images_admin_update on storage.objects
    for update to authenticated
    using (bucket_id = 'product-images' and (select public.is_admin()))
    with check (
      bucket_id = 'product-images'
      and (select public.is_admin())
      and name ~ '^[a-f0-9]{32}\.(jpg|png|webp)$'
    )
  $policy$;
  execute $policy$
    create policy product_images_admin_delete on storage.objects
    for delete to authenticated
    using (bucket_id = 'product-images' and (select public.is_admin()))
  $policy$;
end $$;
