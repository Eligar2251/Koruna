-- Заказы и назначение администраторов. Применять после 20261017130000_harden_catalog.sql.
-- password_key — JWT с односторонним ключом пароля. Сам пароль из него не читается.
-- Сессия остаётся отдельным JWT в HttpOnly-куке.

create table if not exists public.staff (
  user_id uuid primary key,
  email text not null check (char_length(email) between 3 and 200),
  name text not null check (char_length(name) between 2 and 120),
  password_key text not null check (char_length(password_key) between 20 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  phone text not null check (char_length(phone) between 6 and 40),
  email text check (email is null or char_length(email) <= 200),
  address text check (address is null or char_length(address) <= 300),
  comment text check (comment is null or char_length(comment) <= 1000),
  items jsonb not null,
  total numeric(12, 2),
  status text not null default 'new' check (char_length(status) between 1 and 40),
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;
alter table public.staff force row level security;
alter table public.orders enable row level security;
alter table public.orders force row level security;

revoke all on table public.staff from public, anon, authenticated;
revoke all on table public.orders from public, anon, authenticated;

drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders
for insert to anon, authenticated
with check (
  char_length(customer_name) between 2 and 120
  and char_length(phone) between 6 and 40
  and jsonb_typeof(items) = 'array'
  and jsonb_array_length(items) between 1 and 40
);

drop policy if exists orders_admin_select on public.orders;
create policy orders_admin_select on public.orders
for select to authenticated
using (public.is_admin());

grant insert on public.orders to anon, authenticated;
grant select on public.orders to authenticated;

create or replace function public.grant_admin(new_user_id uuid, new_email text, new_name text, new_password_key text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Нет доступа';
  end if;
  if new_user_id is null
    or new_email is null
    or char_length(trim(new_email)) < 3
    or char_length(trim(new_name)) < 2
    or char_length(new_password_key) < 20 then
    raise exception 'Некорректные данные';
  end if;
  insert into public.admin_users (user_id) values (new_user_id)
  on conflict do nothing;
  insert into public.staff (user_id, email, name, password_key)
  values (new_user_id, lower(trim(new_email)), left(trim(new_name), 120), new_password_key)
  on conflict (user_id) do update
    set email = excluded.email,
        name = excluded.name,
        password_key = excluded.password_key;
end;
$$;

create or replace function public.list_staff()
returns table (user_id uuid, email text, name text, created_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Нет доступа';
  end if;
  return query
    select s.user_id, s.email, s.name, s.created_at
    from public.staff s
    order by s.created_at;
end;
$$;

revoke all on function public.grant_admin(uuid, text, text, text) from public, anon;
revoke all on function public.list_staff() from public, anon;
grant execute on function public.grant_admin(uuid, text, text, text) to authenticated;
grant execute on function public.list_staff() to authenticated;
