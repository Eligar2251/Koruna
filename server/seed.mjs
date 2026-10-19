const sheets = '/assets/catalog/sheets.jpg'
const gypsum = '/assets/catalog/gypsum.jpg'
const rolls = '/assets/catalog/rolls.jpg'
const boards = '/assets/catalog/boards.jpg'
const membrane = '/assets/catalog/membrane.jpg'
const poly = '/assets/catalog/poly.jpg'
const profiles = '/assets/catalog/profiles.jpg'
const foam = '/assets/catalog/foam.jpg'
const fasteners = '/assets/catalog/fasteners.jpg'
const steel = '/assets/catalog/steel.jpg'

export const seedCategories = [
  { slug: 'listovye-materialy', name: 'Листовые материалы', sort_order: 10, image: sheets },
  { slug: 'osb-3', name: 'ОСП-3', sort_order: 20, image: sheets },
  { slug: 'gipsokarton', name: 'Гипсокартон', sort_order: 30, image: gypsum },
  { slug: 'fanera', name: 'Фанера', sort_order: 40, image: sheets },
  { slug: 'brusok', name: 'Брусок', sort_order: 50, image: sheets },
  { slug: 'uteplitel', name: 'Утеплитель', sort_order: 60, image: rolls },
  { slug: 'plitnyi', name: 'Утеплитель плитный', sort_order: 70, image: boards },
  { slug: 'rulonnyi', name: 'Утеплитель рулонный', sort_order: 80, image: rolls },
  { slug: 'polikarbonat', name: 'Поликарбонат', sort_order: 90, image: poly },
  { slug: 'gidro-paroizolyaziya', name: 'Ветро- и пароизоляция', sort_order: 100, image: membrane },
  { slug: 'profil-karkas', name: 'Профиль и каркас', sort_order: 110, image: profiles },
  { slug: 'montajnaya-himiya', name: 'Монтажная химия', sort_order: 120, image: foam },
  { slug: 'krepej-i-metizy', name: 'Крепёж и метизы', sort_order: 130, image: fasteners },
  { slug: 'krovelnye-materialy', name: 'Кровельные материалы', sort_order: 140, image: steel },
]

export const seedProducts = [
  { slug: 'osp-3-9', name: 'ОСП-3 9 мм 1250×2500', category: 'osb-3', price: 890, unit: 'лист', image: sheets, sort_order: 10 },
  { slug: 'osp-3-12', name: 'ОСП-3 12 мм 1250×2500', category: 'osb-3', price: 1180, unit: 'лист', image: sheets, sort_order: 20 },
  { slug: 'gkl-125', name: 'Гипсокартон 12,5 мм', category: 'gipsokarton', price: 420, unit: 'лист', image: gypsum, sort_order: 30 },
  { slug: 'gklv-125', name: 'Гипсокартон влагостойкий 12,5 мм', category: 'gipsokarton', price: 560, unit: 'лист', image: gypsum, sort_order: 40 },
  { slug: 'fanera-18', name: 'Фанера ФК 18 мм', category: 'fanera', price: 2100, unit: 'лист', image: sheets, sort_order: 50 },
  { slug: 'brusok-50', name: 'Брусок 50×50×3000', category: 'brusok', price: 180, unit: 'шт', image: sheets, sort_order: 60 },
  { slug: 'uteplitel-50', name: 'Утеплитель плитный 50 мм', category: 'plitnyi', price: 1450, unit: 'упак', image: boards, sort_order: 70 },
  { slug: 'uteplitel-100', name: 'Утеплитель плитный 100 мм', category: 'plitnyi', price: 1680, unit: 'упак', image: boards, sort_order: 80 },
  { slug: 'xps-50', name: 'XPS 50 мм', category: 'plitnyi', price: 620, unit: 'лист', image: boards, sort_order: 90 },
  { slug: 'rulon-50', name: 'Утеплитель рулонный 50 мм', category: 'rulonnyi', price: 980, unit: 'рулон', image: rolls, sort_order: 100 },
  { slug: 'polikarbonat-4', name: 'Поликарбонат 4 мм', category: 'polikarbonat', price: 890, unit: 'лист', image: poly, sort_order: 110 },
  { slug: 'polikarbonat-8', name: 'Поликарбонат 8 мм', category: 'polikarbonat', price: 1540, unit: 'лист', image: poly, sort_order: 120 },
  { slug: 'izospan-a', name: 'Изоспан A', category: 'gidro-paroizolyaziya', price: 2100, unit: 'рулон', image: membrane, sort_order: 130 },
  { slug: 'membrana', name: 'Мембрана ветрозащитная', category: 'gidro-paroizolyaziya', price: 2650, unit: 'рулон', image: membrane, sort_order: 140 },
  { slug: 'profil-pp-60', name: 'Профиль ПП 60×27 3 м', category: 'profil-karkas', price: 145, unit: 'шт', image: profiles, sort_order: 150 },
  { slug: 'profil-pn-28', name: 'Профиль направляющий 27×28 3 м', category: 'profil-karkas', price: 130, unit: 'шт', image: profiles, sort_order: 160 },
  { slug: 'pena', name: 'Пена монтажная', category: 'montajnaya-himiya', price: 420, unit: 'шт', image: foam, sort_order: 170 },
  { slug: 'kley-uteplitel', name: 'Клей для утеплителя', category: 'montajnaya-himiya', price: 890, unit: 'шт', image: foam, sort_order: 180 },
  { slug: 'samorez', name: 'Саморез по металлу, упаковка', category: 'krepej-i-metizy', price: 640, unit: 'упак', image: fasteners, sort_order: 190 },
  { slug: 'dyubel', name: 'Дюбель-гвоздь, упаковка', category: 'krepej-i-metizy', price: 520, unit: 'упак', image: fasteners, sort_order: 200 },
  { slug: 'profnastil-s8', name: 'Профнастил С8', category: 'krovelnye-materialy', price: 690, unit: 'м²', image: steel, sort_order: 210 },
  { slug: 'metallocherepica', name: 'Металлочерепица', category: 'krovelnye-materialy', price: 780, unit: 'м²', image: steel, sort_order: 220 },
]

export async function seedFileStore(store) {
  const ids = new Map()
  for (const category of seedCategories) {
    const row = await store.saveCategory({
      name: category.name,
      slug: category.slug,
      sort_order: category.sort_order,
      is_active: true,
    })
    ids.set(category.slug, row.id)
  }
  for (const product of seedProducts) {
    await store.saveProduct({
      name: product.name,
      slug: product.slug,
      category_id: ids.get(product.category),
      price: product.price,
      unit: product.unit,
      image_url: product.image,
      sort_order: product.sort_order,
      in_stock: true,
      is_active: true,
    })
  }
}
