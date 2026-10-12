// Контакты и реквизиты. Пустые поля на сайте скрываются автоматически.
export const site = {
  brand: 'ЦСБ',
  title: 'ЦСБ — строительные материалы в Новосибирске',
  description:
    'Строительные материалы в Новосибирске и области: листовые материалы, утеплители, профиль, крепёж и монтажная химия. Заявка онлайн, доставка по Новосибирску и области.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  city: 'Новосибирск',
  deliveryArea: 'Новосибирск и Новосибирская область',
  phone: '',
  phoneHref: '',
  email: '',
  address: '',
  workHours: '',
  telegram: '',
  whatsapp: '',
  max: '',
} as const

export const company = {
  name: 'ООО «Коруна»',
  fullName: 'Общество с ограниченной ответственностью «Коруна»',
  legalAddress: 'г. Москва',
  inn: '',
  kpp: '',
  ogrn: '',
  bank: '',
  bankAccount: '',
  bankCorrAccount: '',
  bik: '',
} as const

export const contactChannels = [
  { value: 'phone', label: 'Телефон' },
  { value: 'email', label: 'Почта' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'max', label: 'Max' },
] as const

export type ContactChannel = (typeof contactChannels)[number]['value']
