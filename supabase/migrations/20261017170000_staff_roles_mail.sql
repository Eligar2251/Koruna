-- Добавочная миграция: роли и доставка уведомлений. Существующие данные сохраняются.
begin;
alter table public.admin_users add column if not exists role text not null default 'admin' check(role in ('admin','owner'));
-- The earliest existing administrator becomes the initial owner once, not every deploy.
update public.admin_users set role='owner' where user_id=(select user_id from public.admin_users order by created_at,user_id limit 1) and not exists(select 1 from public.admin_users where role='owner');
create or replace function public.is_owner() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.admin_users where user_id=auth.uid() and role='owner');
$$;
revoke all on function public.is_owner() from public,anon;
grant execute on function public.is_owner() to authenticated;
create or replace function public.grant_staff(new_user_id uuid,new_email text,new_name text,new_password_key text,new_role text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.is_admin() or new_role is null or new_role not in ('admin','owner') then raise exception 'Нет доступа'; end if;
 if new_role='owner' and not public.is_owner() then raise exception 'Только владелец назначает владельцев'; end if;
 if new_user_id is null or new_email is null or char_length(new_email)>200 or char_length(trim(new_name)) not between 2 and 120 or char_length(new_password_key)<20 then raise exception 'Некорректные данные'; end if;
 -- Existing accounts can only change roles via set_staff_role; never through this function.
 if exists(select 1 from public.admin_users where user_id=new_user_id) then raise exception 'Администратор уже есть'; end if;
 insert into public.admin_users(user_id,role)values(new_user_id,new_role);
 insert into public.staff(user_id,email,name,password_key)values(new_user_id,lower(trim(new_email)),trim(new_name),new_password_key);
end; $$;
create or replace function public.grant_admin(new_user_id uuid,new_email text,new_name text,new_password_key text)
returns void language plpgsql security definer set search_path='' as $$
begin perform public.grant_staff(new_user_id,new_email,new_name,new_password_key,'admin'); end; $$;
create or replace function public.set_staff_role(p_user_id uuid,p_role text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.is_owner() then raise exception 'Нет доступа'; end if;
 if p_role is null or p_role not in ('admin','owner') then raise exception 'Некорректная роль'; end if;
 perform 1 from public.admin_users order by user_id for update;
 if not public.is_owner() then raise exception 'Нет доступа'; end if;
 if not exists(select 1 from public.admin_users where user_id=p_user_id) then raise exception 'Администратор не найден'; end if;
 if p_role='admin' and (select role from public.admin_users where user_id=p_user_id)='owner' and (select count(*) from public.admin_users where role='owner')<2 then raise exception 'Нельзя убрать последнего владельца'; end if;
 update public.admin_users set role=p_role where user_id=p_user_id;
end; $$;
drop function public.list_staff();
create function public.list_staff() returns table(user_id uuid,email text,name text,created_at timestamptz,role text)
language plpgsql security definer set search_path='' as $$
begin
 if not public.is_admin() then raise exception 'Нет доступа'; end if;
 return query select a.user_id,coalesce(s.email,''),coalesce(s.name,'Сотрудник'),a.created_at,a.role from public.admin_users a left join public.staff s using(user_id) order by a.created_at;
end; $$;
revoke all on function public.grant_staff(uuid,text,text,text,text), public.set_staff_role(uuid,text),public.list_staff() from public,anon;
grant execute on function public.grant_staff(uuid,text,text,text,text),public.set_staff_role(uuid,text),public.list_staff() to authenticated;

alter table public.orders add column if not exists email_status text not null default 'pending' check(email_status in ('pending','sent','failed','unconfigured'));
alter table public.orders add column if not exists email_attempted_at timestamptz;
alter table public.orders add column if not exists email_token_hash text;
-- A per-request unguessable capability can only acknowledge email delivery, never read orders.
create or replace function public.finish_request_email(p_id uuid,p_token_hash text,p_status text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if p_status is null or p_status not in ('sent','failed','unconfigured') or char_length(p_token_hash)<>64 then raise exception 'Некорректное состояние'; end if;
 update public.orders set email_status=p_status,email_attempted_at=now(),email_token_hash=null
 where id=p_id and email_token_hash=p_token_hash and email_status='pending';
 if not found then raise exception 'Нет доступа'; end if;
end; $$;
revoke all on function public.finish_request_email(uuid,text,text) from public;
grant execute on function public.finish_request_email(uuid,text,text) to anon,authenticated;
commit;
