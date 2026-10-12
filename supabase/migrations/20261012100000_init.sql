-- ЦСБ: каталог, заявки и администраторы
-- Применять в Supabase: SQL Editor -> New query -> вставить содержимое файла -> Run

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = (select auth.uid())
  );
$$;

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

-- Категории каталога
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,80}$'),
  name text not null check (char_length(name) between 1 and 200),
  description text check (description is null or char_length(description) <= 2000),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();

-- Товары
create table public.products (
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
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products (category_id);
create index products_active_idx on public.products (is_active, sort_order);

create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

-- Заявки: заказ из корзины, звонок, сообщение из формы контактов
create type public.lead_type as enum ('order', 'callback', 'contact');
create type public.lead_status as enum ('new', 'in_progress', 'done', 'cancelled');

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  type public.lead_type not null,
  status public.lead_status not null default 'new',
  name text not null check (char_length(name) between 1 and 200),
  phone text check (phone is null or char_length(phone) <= 30),
  email text check (email is null or char_length(email) <= 254),
  preferred_contact text not null
    check (preferred_contact in ('phone', 'email', 'telegram', 'whatsapp', 'max')),
  delivery_method text check (delivery_method is null or delivery_method in ('pickup', 'delivery')),
  address text check (address is null or char_length(address) <= 500),
  comment text check (comment is null or char_length(comment) <= 3000),
  items jsonb not null default '[]'::jsonb
    check (jsonb_typeof(items) = 'array' and char_length(items::text) <= 50000),
  total numeric(12, 2) check (total is null or total >= 0),
  consent_pd boolean not null check (consent_pd = true),
  consent_version text not null check (char_length(consent_version) <= 20),
  consent_at timestamptz not null default now(),
  source_page text check (source_page is null or char_length(source_page) <= 300),
  admin_note text check (admin_note is null or char_length(admin_note) <= 3000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_contact_present check (
    (phone is not null and char_length(phone) > 0)
    or (email is not null and char_length(email) > 0)
  )
);

create index leads_status_created_idx on public.leads (status, created_at desc);

create trigger leads_updated_at before update on public.leads
for each row execute function public.set_updated_at();

-- Права доступа (RLS)
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.leads enable row level security;

-- admin_users: админ видит только свою запись; новых админов добавляем вручную в SQL Editor
create policy "admin_users_self_read" on public.admin_users
for select to authenticated
using (user_id = (select auth.uid()));

-- categories
create policy "categories_public_read" on public.categories
for select to anon, authenticated
using (is_active or (select public.is_admin()));

create policy "categories_admin_insert" on public.categories
for insert to authenticated
with check ((select public.is_admin()));

create policy "categories_admin_update" on public.categories
for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "categories_admin_delete" on public.categories
for delete to authenticated
using ((select public.is_admin()));

-- products
create policy "products_public_read" on public.products
for select to anon, authenticated
using (is_active or (select public.is_admin()));

create policy "products_admin_insert" on public.products
for insert to authenticated
with check ((select public.is_admin()));

create policy "products_admin_update" on public.products
for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "products_admin_delete" on public.products
for delete to authenticated
using ((select public.is_admin()));

-- leads: отправлять заявку может любой посетитель; читать и менять — только админ
create policy "leads_public_insert" on public.leads
for insert to anon, authenticated
with check (true);

create policy "leads_admin_select" on public.leads
for select to authenticated
using ((select public.is_admin()));

create policy "leads_admin_update" on public.leads
for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "leads_admin_delete" on public.leads
for delete to authenticated
using ((select public.is_admin()));

revoke all on public.admin_users from anon;
revoke all on public.leads from anon;
grant insert on public.leads to anon;
