-- Без очистки данных. Выполнить после существующих миграций в SQL Editor.
-- NULL означает, что остаток ещё не поставлен на учёт, а не нулевой остаток.
begin;
alter table public.products add column if not exists stock_quantity integer
  check (stock_quantity between 0 and 1000000000);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  delta integer not null check (delta <> 0 and delta between -1000000000 and 1000000000),
  kind text not null check (kind in ('receipt', 'write_off', 'adjustment')),
  note text not null check (char_length(note) between 2 and 500),
  balance integer not null check (balance between 0 and 1000000000),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create index if not exists stock_movements_date_idx on public.stock_movements (created_at desc);
create index if not exists stock_movements_product_idx on public.stock_movements (product_id);
alter table public.stock_movements enable row level security;
alter table public.stock_movements force row level security;
revoke all on public.stock_movements from public, anon, authenticated;
grant select on public.stock_movements to authenticated;
create policy stock_admin_read on public.stock_movements
  for select to authenticated using ((select public.is_admin()));

create or replace function public.adjust_stock(p_product_id uuid, p_delta integer, p_kind text, p_note text)
returns public.stock_movements
language plpgsql security definer set search_path = ''
as $$
declare
  product public.products;
  movement public.stock_movements;
  next_balance bigint;
begin
  if not public.is_admin() then raise exception 'Нет доступа'; end if;
  if p_delta is null or p_delta = 0 or abs(p_delta::bigint) > 1000000000
    or p_kind is null or p_kind not in ('receipt', 'write_off', 'adjustment')
    or (p_kind = 'receipt' and p_delta < 0) or (p_kind = 'write_off' and p_delta > 0)
    or p_note is null or char_length(trim(p_note)) not between 2 and 500 then
    raise exception 'Некорректная складская операция';
  end if;
  select * into product from public.products where id = p_product_id for update;
  if not found then raise exception 'Товар не найден'; end if;
  next_balance := coalesce(product.stock_quantity, 0)::bigint + p_delta;
  if next_balance < 0 or next_balance > 1000000000 then
    raise exception 'Некорректный остаток: недостаточно товара или превышен лимит';
  end if;
  update public.products set stock_quantity = next_balance::integer, in_stock = (next_balance > 0)
    where id = p_product_id;
  insert into public.stock_movements(product_id, product_name, delta, kind, note, balance)
    values (p_product_id, product.name, p_delta, p_kind, trim(p_note), next_balance::integer)
    returning * into movement;
  return movement;
end;
$$;
revoke all on function public.adjust_stock(uuid, integer, text, text) from public, anon;
grant execute on function public.adjust_stock(uuid, integer, text, text) to authenticated;

-- Остатки меняются только через атомарную операцию с журналом, не обычным PUT товара.
revoke insert, update on public.products from authenticated;
grant insert (slug, name, category_id, sku, description, price, unit, image_url, in_stock, sort_order, is_active)
  on public.products to authenticated;
grant update (slug, name, category_id, sku, description, price, unit, image_url, in_stock, sort_order, is_active)
  on public.products to authenticated;

drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
grant update (status) on public.orders to authenticated;
alter table public.orders add constraint orders_status_valid
  check (status in ('new', 'processing', 'completed', 'cancelled'));
commit;
