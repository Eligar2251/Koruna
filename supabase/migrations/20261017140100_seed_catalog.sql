-- Базовый каталог. Повторный запуск не затирает уже изменённые строки.
insert into public.categories (slug, name, sort_order)
values
  ('listovye-materialy', 'Листовые материалы', 10),
  ('osb-3', 'ОСП-3', 20),
  ('gipsokarton', 'Гипсокартон', 30),
  ('fanera', 'Фанера', 40),
  ('brusok', 'Брусок', 50),
  ('uteplitel', 'Утеплитель', 60),
  ('plitnyi', 'Утеплитель плитный', 70),
  ('rulonnyi', 'Утеплитель рулонный', 80),
  ('polikarbonat', 'Поликарбонат', 90),
  ('gidro-paroizolyaziya', 'Ветро- и пароизоляция', 100),
  ('profil-karkas', 'Профиль и каркас', 110),
  ('montajnaya-himiya', 'Монтажная химия', 120),
  ('krepej-i-metizy', 'Крепёж и метизы', 130),
  ('krovelnye-materialy', 'Кровельные материалы', 140)
on conflict (slug) do nothing;

insert into public.products (slug, name, category_id, price, unit, image_url, sort_order, in_stock, is_active)
select v.slug, v.name, c.id, v.price, v.unit, v.image_url, v.sort_order, true, true
from (values
  ('osp-3-9', 'ОСП-3 9 мм 1250×2500', 'osb-3', 890, 'лист', '/assets/catalog/sheets.jpg', 10),
  ('osp-3-12', 'ОСП-3 12 мм 1250×2500', 'osb-3', 1180, 'лист', '/assets/catalog/sheets.jpg', 20),
  ('gkl-125', 'Гипсокартон 12,5 мм', 'gipsokarton', 420, 'лист', '/assets/catalog/gypsum.jpg', 30),
  ('gklv-125', 'Гипсокартон влагостойкий 12,5 мм', 'gipsokarton', 560, 'лист', '/assets/catalog/gypsum.jpg', 40),
  ('fanera-18', 'Фанера ФК 18 мм', 'fanera', 2100, 'лист', '/assets/catalog/sheets.jpg', 50),
  ('brusok-50', 'Брусок 50×50×3000', 'brusok', 180, 'шт', '/assets/catalog/sheets.jpg', 60),
  ('uteplitel-50', 'Утеплитель плитный 50 мм', 'plitnyi', 1450, 'упак', '/assets/catalog/boards.jpg', 70),
  ('uteplitel-100', 'Утеплитель плитный 100 мм', 'plitnyi', 1680, 'упак', '/assets/catalog/boards.jpg', 80),
  ('xps-50', 'XPS 50 мм', 'plitnyi', 620, 'лист', '/assets/catalog/boards.jpg', 90),
  ('rulon-50', 'Утеплитель рулонный 50 мм', 'rulonnyi', 980, 'рулон', '/assets/catalog/rolls.jpg', 100),
  ('polikarbonat-4', 'Поликарбонат 4 мм', 'polikarbonat', 890, 'лист', '/assets/catalog/poly.jpg', 110),
  ('polikarbonat-8', 'Поликарбонат 8 мм', 'polikarbonat', 1540, 'лист', '/assets/catalog/poly.jpg', 120),
  ('izospan-a', 'Изоспан A', 'gidro-paroizolyaziya', 2100, 'рулон', '/assets/catalog/membrane.jpg', 130),
  ('membrana', 'Мембрана ветрозащитная', 'gidro-paroizolyaziya', 2650, 'рулон', '/assets/catalog/membrane.jpg', 140),
  ('profil-pp-60', 'Профиль ПП 60×27 3 м', 'profil-karkas', 145, 'шт', '/assets/catalog/profiles.jpg', 150),
  ('profil-pn-28', 'Профиль направляющий 27×28 3 м', 'profil-karkas', 130, 'шт', '/assets/catalog/profiles.jpg', 160),
  ('pena', 'Пена монтажная', 'montajnaya-himiya', 420, 'шт', '/assets/catalog/foam.jpg', 170),
  ('kley-uteplitel', 'Клей для утеплителя', 'montajnaya-himiya', 890, 'шт', '/assets/catalog/foam.jpg', 180),
  ('samorez', 'Саморез по металлу, упаковка', 'krepej-i-metizy', 640, 'упак', '/assets/catalog/fasteners.jpg', 190),
  ('dyubel', 'Дюбель-гвоздь, упаковка', 'krepej-i-metizy', 520, 'упак', '/assets/catalog/fasteners.jpg', 200),
  ('profnastil-s8', 'Профнастил С8', 'krovelnye-materialy', 690, 'м²', '/assets/catalog/steel.jpg', 210),
  ('metallocherepica', 'Металлочерепица', 'krovelnye-materialy', 780, 'м²', '/assets/catalog/steel.jpg', 220)
) as v(slug, name, category, price, unit, image_url, sort_order)
join public.categories c on c.slug = v.category
on conflict (slug) do nothing;

