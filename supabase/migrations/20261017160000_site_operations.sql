-- Добавочная миграция, без очистки. URL + anon; запись только под JWT администратора.
begin;
create table if not exists public.site_settings (
  id text primary key check (id = 'main'),
  config jsonb not null default '{}'::jsonb
);
insert into public.site_settings(id) values ('main') on conflict do nothing;
alter table public.site_settings enable row level security;
alter table public.site_settings force row level security;
revoke all on public.site_settings from public, anon, authenticated;
grant select on public.site_settings to anon, authenticated;
create policy site_settings_read on public.site_settings for select to anon, authenticated using (true);
create or replace function public.save_site_settings(p_config jsonb, p_expected text)
returns void language plpgsql security definer set search_path = '' as $$
declare old_config jsonb;
begin
  if not public.is_admin() then raise exception 'Нет доступа'; end if;
  if jsonb_typeof(p_config) <> 'object' or octet_length(p_config::text) > 4000000 then raise exception 'Некорректные настройки'; end if;
  select config into old_config from public.site_settings where id = 'main' for update;
  if coalesce(old_config->>'revision', '') <> coalesce(p_expected, '') then raise exception 'Настройки уже изменены'; end if;
  update public.site_settings set config = p_config where id = 'main';
end; $$;
revoke all on function public.save_site_settings(jsonb, text) from public, anon;
grant execute on function public.save_site_settings(jsonb, text) to authenticated;

alter table public.orders add column if not exists request_kind text not null default 'order'
  check (request_kind in ('order', 'inquiry'));
alter table public.orders add column if not exists consent jsonb;
drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders for insert to anon, authenticated with check (
  char_length(customer_name) between 2 and 120 and char_length(phone) between 6 and 40
  and (select config->>'privacyReady' from public.site_settings where id = 'main') = 'true'
  and consent->>'revision' = (select config->>'revision' from public.site_settings where id = 'main')
  and char_length(coalesce(email, '')) <= 200 and char_length(coalesce(comment, '')) <= 1000
  and char_length(coalesce(address, '')) <= 300 and octet_length(items::text) <= 200000
  and status = 'new' and consent is not null and consent->>'accepted' = 'true'
  and char_length(consent->>'version') between 1 and 100 and consent->>'at' is not null
  and jsonb_typeof(items) = 'array'
  and ((request_kind = 'order' and jsonb_array_length(items) between 1 and 40)
    or (request_kind = 'inquiry' and jsonb_array_length(items) = 0 and total is null))
);

create or replace function public.bulk_update_products(p_rows jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare r jsonb; product public.products; seen uuid[] := '{}';
begin
  if not public.is_admin() then raise exception 'Нет доступа'; end if;
  if p_rows is null or jsonb_typeof(p_rows) <> 'array' or jsonb_array_length(p_rows) not between 1 and 100 then raise exception 'Некорректный пакет товаров'; end if;
  -- Один пакет — одна транзакция. Стабильный порядок блокировок.
  perform 1 from public.products where id in (select (value->>'id')::uuid from jsonb_array_elements(p_rows)) order by id for update;
  -- Временные уникальные адреса позволяют обмен slug между выбранными строками.
  update public.products set slug = 'bulk-' || gen_random_uuid()::text
  where id in (select (value->>'id')::uuid from jsonb_array_elements(p_rows));
  for r in select value from jsonb_array_elements(p_rows) loop
    if (r->>'id')::uuid = any(seen) then raise exception 'Повтор товара'; end if;
    seen := array_append(seen, (r->>'id')::uuid);
    select * into product from public.products where id = (r->>'id')::uuid;
    if not found then raise exception 'Товар не найден'; end if;
    update public.products set
      name = r->>'name', slug = r->>'slug', category_id = nullif(r->>'category_id', '')::uuid,
      sku = r->>'sku', description = r->>'description', price = nullif(r->>'price', '')::numeric,
      unit = r->>'unit', sort_order = (r->>'sort_order')::integer,
      is_active = (r->>'is_active')::boolean,
      in_stock = case when product.stock_quantity is not null then product.stock_quantity > 0 else (r->>'in_stock')::boolean end,
      image_url = r->>'image_url'
    where id = product.id;
  end loop;
end; $$;
revoke all on function public.bulk_update_products(jsonb) from public, anon;
grant execute on function public.bulk_update_products(jsonb) to authenticated;
commit;
