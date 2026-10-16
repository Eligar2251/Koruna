-- Разделы и товары каталога. Применять после 20261017120000_clean_database.sql.
-- Чтение опубликованных записей — у посетителей. Запись — у администраторов
-- (public.admin_users) и у service role, которым пользуется сервер сайта.

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end $$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,80}$'),
  name text not null check (char_length(name) between 1 and 200),
  description text check (description is null or char_length(description) <= 2000),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,120}$'),
  name text not null check (char_length(name) between 1 and 300),
  sku text check (sku is null or char_length(sku) <= 80),
  description text check (description is null or char_length(description) <= 10000),
  price numeric(12, 2) check (price is null or price >= 0),
  unit text not null default 'шт' check (char_length(unit) between 1 and 30),
  in_stock boolean not null default true,
  image_url text check (image_url is null or char_length(image_url) <= 2000),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (is_active, sort_order);
create index if not exists categories_active_idx on public.categories (is_active, sort_order);

do $$
begin
  if to_regclass('auth.users') is not null then
    execute $sql$
      create table if not exists public.admin_users (
        user_id uuid primary key references auth.users (id) on delete cascade,
        created_at timestamptz not null default now()
      )
    $sql$;
  else
    execute $sql$
      create table if not exists public.admin_users (
        user_id uuid primary key,
        created_at timestamptz not null default now()
      )
    $sql$;
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

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
  uid := null;
  begin
    uid := nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
  exception
    when others then
      uid := null;
  end;
  if uid is null then
    begin
      execute 'select auth.uid()' into uid;
    exception
      when others then
        uid := null;
    end;
  end if;
  return exists (
    select 1 from public.admin_users a
    where a.user_id = uid
  );
end;
$$;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
for select to anon, authenticated
using (is_active or (select public.is_admin()));

drop policy if exists categories_admin_insert on public.categories;
create policy categories_admin_insert on public.categories
for insert to authenticated
with check ((select public.is_admin()));

drop policy if exists categories_admin_update on public.categories;
create policy categories_admin_update on public.categories
for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists categories_admin_delete on public.categories;
create policy categories_admin_delete on public.categories
for delete to authenticated
using ((select public.is_admin()));

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
for select to anon, authenticated
using (is_active or (select public.is_admin()));

drop policy if exists products_admin_insert on public.products;
create policy products_admin_insert on public.products
for insert to authenticated
with check ((select public.is_admin()));

drop policy if exists products_admin_update on public.products;
create policy products_admin_update on public.products
for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists products_admin_delete on public.products;
create policy products_admin_delete on public.products
for delete to authenticated
using ((select public.is_admin()));

drop policy if exists admin_users_self_read on public.admin_users;
create policy admin_users_self_read on public.admin_users
for select to authenticated
using (user_id = (
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
));

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products to anon, authenticated;
grant insert, update, delete on public.categories, public.products to authenticated;
revoke all on public.admin_users from anon;
grant select on public.admin_users to authenticated;

-- Фото товаров. Если схемы storage нет, блок пропускается.
do $$
begin
  if to_regclass('storage.buckets') is null then
    return;
  end if;

  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
    'product-images',
    'product-images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  )
  on conflict (id) do update set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

  if to_regclass('storage.objects') is null then
    return;
  end if;

  execute 'drop policy if exists product_images_public_read on storage.objects';
  execute 'drop policy if exists product_images_admin_insert on storage.objects';
  execute 'drop policy if exists product_images_admin_update on storage.objects';
  execute 'drop policy if exists product_images_admin_delete on storage.objects';

  execute $policy$
    create policy product_images_public_read on storage.objects
    for select to anon, authenticated
    using (bucket_id = 'product-images')
  $policy$;
  execute $policy$
    create policy product_images_admin_insert on storage.objects
    for insert to authenticated
    with check (bucket_id = 'product-images' and (select public.is_admin()))
  $policy$;
  execute $policy$
    create policy product_images_admin_update on storage.objects
    for update to authenticated
    using (bucket_id = 'product-images' and (select public.is_admin()))
    with check (bucket_id = 'product-images' and (select public.is_admin()))
  $policy$;
  execute $policy$
    create policy product_images_admin_delete on storage.objects
    for delete to authenticated
    using (bucket_id = 'product-images' and (select public.is_admin()))
  $policy$;
end $$;
