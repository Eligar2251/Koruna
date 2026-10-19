"use client";
import { useEffect, useState } from "react";
import { adminApi } from "./api";
export function MailSettings() {
  const [data, setData] = useState<{
      configured: boolean;
      recipient: string;
      privacyReady: boolean;
      requestsEnabled: boolean;
    } | null>(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let mounted = true;
    const reload = () =>
      adminApi("/api/admin/mail")
        .then((data) => {
          if (mounted) setData(data);
        })
        .catch(() => {
          if (mounted) setMessage("Не удалось проверить настройки почты");
        });
    reload();
    window.addEventListener("csb:data-changed", reload);
    return () => {
      mounted = false;
      window.removeEventListener("csb:data-changed", reload);
    };
  }, []);
  return (
    <section className="panel">
      <h2>Приём заявок и почта</h2>
      <p>
        Заявки и расчёты сохраняются в разделе «Заказы» до отправки письма. Если
        почта недоступна, заявка не теряется; в её карточке есть повторная
        отправка.
      </p>
      {data && (
        <>
          <p>
            SMTP:{" "}
            <strong>
              {data.configured
                ? "настроен (доставку проверяет тест)"
                : "не настроен"}
            </strong>
            . Получатель: {data.recipient}.
          </p>
          <p>
            Приём форм:{" "}
            {data.requestsEnabled
              ? "включён"
              : "выключен — включите «Принимать заявки с сайта» в настройках сайта"}
            .
          </p>
          {!data.privacyReady && (
            <p className="error" role="status">
              Юридические сведения не подтверждены. Заполните реквизиты,
              фактическое место хранения, обработчиков и срок хранения в
              настройках сайта. Доставка почты и включение форм не подтверждают
              соответствие 152-ФЗ.
            </p>
          )}
        </>
      )}
      <p>
        В серверном .env задайте SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER,
        SMTP_PASSWORD и MAIL_FROM. REQUESTS_EMAIL задаёт отдельный адрес приёма;
        по умолчанию используется почта сайта. После изменения перезапустите
        сервер. Пароль почты не хранится в публичных настройках.
      </p>
      <button
        type="button"
        disabled={busy || !data?.configured}
        onClick={async () => {
          setBusy(true);
          try {
            const result = await adminApi("/api/admin/mail", {
              method: "POST",
            });
            setMessage(
              result.status === "sent"
                ? "Письмо принято почтовым сервером. Проверьте входящие и спам."
                : "Письмо не отправлено. Проверьте адреса, SMTP, пароль приложения и доступность почтового сервера.",
            );
          } catch (err) {
            setMessage(err instanceof Error ? err.message : "Ошибка проверки");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Отправляем…" : "Отправить тестовое письмо"}
      </button>
      {message && <p role="status">{message}</p>}
    </section>
  );
}
