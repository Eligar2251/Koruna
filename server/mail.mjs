import nodemailer from "nodemailer";
const email = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
export function mailConfiguration(fields, env = process.env) {
  const host = env.SMTP_HOST || "",
    port = Number(env.SMTP_PORT || 465);
  const from = env.MAIL_FROM || env.SMTP_USER || "",
    to = env.REQUESTS_EMAIL || fields.email || "";
  if (
    !host ||
    !env.SMTP_USER ||
    !env.SMTP_PASSWORD ||
    !email.test(from) ||
    !email.test(to) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  )
    return null;
  return {
    host,
    port,
    secure: env.SMTP_SECURE ? env.SMTP_SECURE === "true" : port === 465,
    from,
    to,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
  };
}
export function requestMessage(order) {
  const title =
    order.request_kind === "inquiry"
      ? "Заявка на расчёт"
      : order.request_kind === "test"
        ? "Проверка почты"
        : "Заказ";
  return {
    subject: `ЦСБ: ${title} № ${String(order.id).slice(0, 8)}`,
    text: [
      `${title} № ${order.id}`,
      `Дата: ${order.created_at || new Date().toISOString()}`,
      `Имя: ${order.customer_name}`,
      `Телефон: ${order.phone}`,
      `Почта: ${order.email || "не указана"}`,
      `Адрес: ${order.address || "не указан"}`,
      `Комментарий: ${order.comment || "не указан"}`,
      ...(order.items || []).map(
        (item) =>
          `${item.name}: ${item.qty} ${item.unit || "шт"}; цена ${item.price == null ? "по запросу" : item.price + " ₽"}`,
      ),
      `Сумма: ${order.total == null ? "требуется расчёт" : order.total + " ₽"}`,
      "Заявка сохранена в админке сайта. Секретный адрес панели в письмах не передаётся.",
    ].join("\n"),
  };
}
export async function sendRequestEmail(
  order,
  fields,
  env = process.env,
  transportFactory = nodemailer.createTransport,
) {
  const config = mailConfiguration(fields, env);
  if (!config) return "unconfigured";
  let transport;
  try {
    transport = transportFactory({
      host: config.host,
      port: config.port,
      secure: config.secure,
      requireTLS: !config.secure,
      auth: { user: config.user, pass: config.password },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
      dnsTimeout: 5000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    const result = await transport.sendMail({
      from: { name: "Центральная Строительная База", address: config.from },
      to: config.to,
      ...(order.email && email.test(order.email)
        ? { replyTo: order.email }
        : {}),
      messageId: `<csb-${order.id}@${config.from.split("@")[1]}>`,
      ...requestMessage(order),
    });
    if (Array.isArray(result.accepted) && !result.accepted.length)
      return "failed";
    return "sent";
  } catch {
    return "failed";
  } finally {
    try {
      transport?.close();
    } catch {
      /* Delivery status must survive transport cleanup errors. */
    }
  }
}
