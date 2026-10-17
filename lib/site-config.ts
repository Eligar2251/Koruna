import { site } from "./site";
export const settingFields: Record<string, string> = {
  short: "Короткое название",
  full: "Полное название сайта",
  phone1: "Телефон 1",
  phone2: "Телефон 2",
  email: "Почта для клиентов",
  address: "Адрес склада",
  directions: "Как добраться / инструкции перед приездом",
  officeHours: "Часы работы офиса",
  warehouseHours: "Часы работы склада",
  legalFull: "Оператор / полное наименование юрлица или ИП",
  inn: "ИНН",
  ogrn: "ОГРН / ОГРНИП",
  kpp: "КПП (если есть)",
  legalAddress: "Юридический адрес",
  postalAddress: "Почтовый адрес",
  director: "Руководитель / представитель",
  account: "Расчётный счёт",
  correspondent: "Корреспондентский счёт",
  bank: "Наименование банка",
  bik: "БИК",
  privacyEmail: "Почта по персональным данным",
  storageLocation: "Место первичного хранения персональных данных (РФ)",
  processors: "Обработчики / подрядчики, цели и места обработки",
  retention: "Срок хранения заявок и основание",
  policyDate: "Дата редакции политики",
  additionalLegal: "Дополнительные реквизиты и сведения об операторе",
};
export type SiteSettings = {
  fields: Record<string, string>;
  content: Record<string, string>;
  images: Record<string, string>;
  privacyReady: boolean;
  requestsEnabled: boolean;
  revision: string;
};
export const defaultSettings: SiteSettings = {
  fields: {
    short: site.short,
    full: site.full,
    phone1: site.phones[0].label,
    phone2: site.phones[1].label,
    email: site.email,
    address: site.address,
    directions:
      "Перед поездкой уточните наличие товара и условия въезда по телефону.",
    officeHours: site.officeHours,
    warehouseHours: site.warehouseHours,
    legalFull: site.legalFull,
    inn: site.inn,
    ogrn: site.ogrn,
    kpp: "",
    legalAddress: "",
    postalAddress: "",
    director: "",
    account: site.account,
    correspondent: "",
    bank: site.bank,
    bik: site.bik,
    privacyEmail: site.email,
    storageLocation: "",
    processors: "",
    retention: "",
    policyDate: "17.10.2026",
    additionalLegal: "",
  },
  content: {},
  images: {},
  privacyReady: false,
  requestsEnabled: false,
  revision: "",
};
export const phoneHref = (phone: string) =>
  "tel:" + phone.replace(/[^+\d]/g, "");
