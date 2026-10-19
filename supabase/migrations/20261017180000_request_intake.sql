-- Приём форм — отдельная настройка, не подтверждение юридической готовности.
-- Не включает формы автоматически; старые опубликованные настройки сохраняют поведение.
begin;
update public.site_settings
set config = config || jsonb_build_object('requestsEnabled', coalesce(config->'privacyReady' = 'true'::jsonb, false))
where not (config ? 'requestsEnabled');

drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders for insert to anon, authenticated with check (
  char_length(customer_name) between 2 and 120 and char_length(phone) between 6 and 40
  and (select coalesce(config->'requestsEnabled', config->'privacyReady', 'false'::jsonb) = 'true'::jsonb from public.site_settings where id = 'main')
  and consent->>'revision' = (select config->>'revision' from public.site_settings where id = 'main')
  and char_length(coalesce(email, '')) <= 200 and char_length(coalesce(comment, '')) <= 1000
  and char_length(coalesce(address, '')) <= 300 and octet_length(items::text) <= 200000
  and status = 'new' and consent is not null and consent->>'accepted' = 'true'
  and char_length(consent->>'version') between 1 and 100 and consent->>'at' is not null
  and jsonb_typeof(items) = 'array'
  and ((request_kind = 'order' and jsonb_array_length(items) between 1 and 40)
    or (request_kind = 'inquiry' and jsonb_array_length(items) = 0 and total is null))
);
commit;
