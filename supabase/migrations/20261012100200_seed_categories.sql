-- Стартовые категории каталога. Названия можно поменять в админке.
-- Применять после 20261012100100_storage.sql

insert into public.categories (slug, name, sort_order) values
  ('listovye-materialy', 'Листовые материалы', 10),
  ('uteplitel', 'Утеплитель', 20),
  ('polikarbonat', 'Поликарбонат', 30),
  ('paroizolyaciya', 'Пароизоляция и ветрозащита', 40),
  ('profil-karkas', 'Профиль и каркас', 50),
  ('montazhnaya-himiya', 'Монтажная химия', 60),
  ('krepezh', 'Крепёж и метизы', 70),
  ('krovelnye-materialy', 'Кровельные материалы', 80)
on conflict (slug) do nothing;
