import { normalizePhone } from './phone.mjs'
export function consentRecord(body, settings) {
  if (!settings.privacyReady)
    throw new Error(
      "Приём заявок ещё не настроен оператором. Свяжитесь по телефону.",
    );
  if (
    body.consent_version !==
    `${settings.fields.policyDate}:${settings.revision}`
  )
    throw new Error(
      "Политика обновлена. Обновите страницу и ознакомьтесь с ней повторно.",
    );
  if (body.consent !== true)
    throw new Error("Укажите согласие на обработку персональных данных");
  return {
    accepted: true,
    at: new Date().toISOString(),
    version: settings.fields.policyDate,
    revision: settings.revision,
    operator: settings.fields.legalFull,
    purpose: "Ответ на обращение и оформление заказа",
    source: "/soglasie",
  };
}
export function buildInquiry(body) {
  const name = String(body.name || "").trim(),
    phone = normalizePhone(body.phone),
    comment = String(body.comment || "").trim();
  if (
    name.length < 2 ||
    name.length > 120 ||
    (phone.match(/\d/g) || []).length < 6 ||
    phone.length > 40 ||
    comment.length > 1000
  )
    throw new Error("Укажите имя, телефон и сообщение до 1000 символов");
  const email = String(body.email || "").trim();
  if (
    email &&
    (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)
  )
    throw new Error("Некорректная почта");
  return {
    customer_name: name,
    phone,
    email: email || null,
    comment: comment || null,
    address: null,
    items: [],
    total: null,
    status: "new",
    request_kind: "inquiry",
  };
}
const attempts = new Map();
export function requestAllowed(req) {
  const ip = (req.headers.get("x-forwarded-for") || "local")
    .split(",")[0]
    .trim();
  const now = Date.now(),
    old = attempts.get(ip);
  if (!old || now > old.until) {
    if (attempts.size > 10000) attempts.clear();
    attempts.set(ip, { count: 1, until: now + 900000 });
    return true;
  }
  return ++old.count <= 12;
}
