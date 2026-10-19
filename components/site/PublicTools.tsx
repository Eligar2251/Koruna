"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { ConsentCheckbox, useSite } from "./SiteProvider";
import { PhoneInput } from "./PhoneInput";
import { phoneHref } from "../../lib/site-config";
import "./design/site-tools.css";

export function PublicTools() {
  const path = usePathname();
  const { settings, inquiry, setInquiry, adminArea } = useSite();
  const dialog = useRef<HTMLDialogElement>(null);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    try {
      setCookieOpen(
        localStorage.getItem("csb-cookie-notice") !== "necessary-v1",
      );
    } catch {
      setCookieOpen(true);
    }
  }, []);
  useEffect(() => {
    if (inquiry) {
      setSent("");
      setError("");
      dialog.current?.querySelector("form")?.reset();
      dialog.current?.showModal();
    } else dialog.current?.close();
  }, [inquiry]);
  if (adminArea || path.startsWith("/admin")) return null;
  const f = settings.fields;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "content-type": "application/json", "x-csb-request": "1" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          email: form.get("email"),
          comment: form.get("comment"),
          consent: form.get("consent") === "on",
          consent_version: form.get("consent_version"),
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Не удалось отправить заявку");
      setSent(data.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось отправить заявку",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <section className="csb-legalbar" aria-label="Реквизиты и документы">
        <div>
          <strong>{f.legalFull}</strong>
          <p>
            ИНН {f.inn} · ОГРН/ОГРНИП {f.ogrn}
            {f.kpp ? ` · КПП ${f.kpp}` : ""}
          </p>
          {f.legalAddress && <p>Юридический адрес: {f.legalAddress}</p>}
          {f.postalAddress && <p>Почтовый адрес: {f.postalAddress}</p>}
          {f.director && <p>Представитель: {f.director}</p>}
          <details>
            <summary>Банковские реквизиты</summary>
            <p>
              {f.bank} · БИК {f.bik}
            </p>
            <p>
              Р/с {f.account}
              {f.correspondent ? ` · К/с ${f.correspondent}` : ""}
            </p>
            {f.additionalLegal && <p>{f.additionalLegal}</p>}
          </details>
        </div>
        <nav>
          <a href="/privacy">Политика конфиденциальности</a>
          <a href="/soglasie">Согласие на обработку ПД</a>
          <a href="/cookies">Использование cookie</a>
          <button type="button" onClick={() => setCookieOpen(true)}>
            Настройки cookie
          </button>
          <button type="button" onClick={() => setInquiry(true)}>
            Оставить заявку
          </button>
        </nav>
      </section>
      {cookieOpen && (
        <aside className="csb-cookie" aria-label="Информация о cookie">
          <p>
            Используем только необходимые cookie и локальное хранилище: вход
            администратора, корзина и сохранение этого выбора. Аналитика и
            реклама не подключены. <a href="/cookies">Подробнее</a>
          </p>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.setItem("csb-cookie-notice", "necessary-v1");
              } catch {}
              setCookieOpen(false);
            }}
          >
            Только необходимые · понятно
          </button>
        </aside>
      )}
      <dialog
        className="csb-inquiry"
        ref={dialog}
        onClose={() => setInquiry(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget && !busy) setInquiry(false);
        }}
        aria-label="Заявка менеджеру"
      >
        <button
          className="csb-inquiry__close"
          type="button"
          aria-label="Закрыть заявку"
          onClick={() => setInquiry(false)}
        >
          ×
        </button>
        {sent ? (
          <>
            <h2>Заявка принята</h2>
            <p>Менеджер свяжется с вами в рабочее время.</p>
            <p>Номер: {sent}</p>
            <button
              type="button"
              className="csb-primary"
              onClick={() => setInquiry(false)}
            >
              Готово
            </button>
          </>
        ) : (
          <>
            <h2>Связаться с менеджером</h2>
            <p>
              Уточним цену, наличие и доставку. Или позвоните:{" "}
              <a href={phoneHref(f.phone1)}>{f.phone1}</a>.
            </p>
            <form onSubmit={submit}>
              <label>
                Имя
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={120}
                />
              </label>
              <label>
                Телефон
                <PhoneInput required />
              </label>
              <label>
                Почта (необязательно)
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={200}
                />
              </label>
              <label>
                Что вас интересует?
                <textarea name="comment" maxLength={1000} rows={3} />
              </label>
              <ConsentCheckbox />
              {error && (
                <p role="alert" className="csb-error">
                  {error}
                </p>
              )}
              <button
                className="csb-primary"
                type="submit"
                disabled={busy || !settings.requestsEnabled}
              >
                {busy ? "Отправляем…" : "Отправить заявку"}
              </button>
            </form>
          </>
        )}
      </dialog>
    </>
  );
}
