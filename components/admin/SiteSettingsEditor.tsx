"use client";
import { useEffect, useState, type FormEvent } from "react";
import { adminApi } from "./api";
import { MediaUpload } from "./MediaUpload";
import {
  defaultSettings,
  settingFields,
  type SiteSettings,
} from "../../lib/site-config";
import media from "../site/media.json";
import content from "../site/content.json";
export function SiteSettingsEditor({
  categories,
}: {
  categories: Array<{ slug: string; name: string }>;
}) {
  const [value, setValue] = useState<SiteSettings>(defaultSettings),
    [section, setSection] = useState("fields"),
    [search, setSearch] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let cancelled = false;
    adminApi("/api/admin/settings")
      .then((data) => {
        if (!cancelled) {
          setValue(data);
          setLoaded(true);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const fields = (
    section === "content"
      ? Object.entries(content)
      : section === "images"
        ? [
            ...Object.entries({
              "location-plan": {
                label: "Схема проезда (если загружена оператором)",
              },
              ...media,
            }).map(([key, v]) => [key, v.label] as [string, string]),
            ...categories.map(
              (c) =>
                [`category:${c.slug}`, `Категория: ${c.name}`] as [
                  string,
                  string,
                ],
            ),
          ]
        : Object.entries(settingFields)
  ).filter(([key, label]) =>
    `${label} ${key}`.toLowerCase().includes(search.toLowerCase()),
  );
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const saved = await adminApi("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(value),
      });
      setValue(saved);
      setNotice(
        "Сохранено. Обновите открытые страницы сайта, чтобы увидеть изменения.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="panel">
      <h2>Сайт и реквизиты оператора</h2>
      <p className="lead">
        Изменения сохраняются в общей базе и применяются к шапке, контактам,
        изображениям, документам и подвалу. Никакие секретные ключи здесь не
        хранятся.
      </p>
      <div className="settings-tabs">
        {[
          ["fields", "Контакты и юрлицо"],
          ["images", "Изображения"],
          ["content", "Тексты страниц"],
        ].map(([key, title]) => (
          <button
            key={key}
            type="button"
            className={section === key ? "" : "ghost"}
            onClick={() => {
              setSection(key);
              setSearch("");
            }}
          >
            {title}
          </button>
        ))}
      </div>
      <input
        aria-label="Поиск настройки"
        value={search}
        placeholder="Найти настройку…"
        onChange={(e) => setSearch(e.target.value)}
      />
      {!loaded && !error && <p>Загрузка настроек…</p>}
      <form onSubmit={save}>
        <div
          className={
            section === "images" ? "settings-media" : "settings-fields"
          }
        >
          {fields.map(([key, label]) =>
            section === "images" ? (
              <div className="settings-image" key={key}>
                <strong>{label}</strong>
                <img
                  src={
                    value.images[key] ||
                    (media as Record<string, { src: string }>)[key]?.src ||
                    "/assets/image-unavailable.svg"
                  }
                  alt="Предпросмотр"
                  onError={(e) => {
                    if (!e.currentTarget.src.endsWith("image-unavailable.svg"))
                      e.currentTarget.src = "/assets/image-unavailable.svg";
                  }}
                />
                <MediaUpload
                  onUploaded={(url) =>
                    setValue((old) => ({
                      ...old,
                      images: { ...old.images, [key]: url },
                    }))
                  }
                />
                <button
                  type="button"
                  className="ghost"
                  onClick={() =>
                    setValue((old) => {
                      const images = { ...old.images };
                      delete images[key];
                      return { ...old, images };
                    })
                  }
                >
                  Вернуть исходное
                </button>
              </div>
            ) : (
              <label key={key}>
                {section === "content" ? label.slice(0, 110) : label}
                {section === "content" ? (
                  <textarea
                    rows={3}
                    value={value.content[key] ?? label}
                    maxLength={12000}
                    onChange={(e) =>
                      setValue((old) => ({
                        ...old,
                        content: { ...old.content, [key]: e.target.value },
                      }))
                    }
                  />
                ) : (
                  <textarea
                    rows={
                      ["processors", "retention", "additionalLegal"].includes(
                        key,
                      )
                        ? 3
                        : 1
                    }
                    value={value.fields[key] || ""}
                    maxLength={4000}
                    onChange={(e) =>
                      setValue((old) => ({
                        ...old,
                        fields: { ...old.fields, [key]: e.target.value },
                      }))
                    }
                  />
                )}
              </label>
            ),
          )}
        </div>
        <div className="privacy-check">
          <h3>Приём заявок</h3>
          <label className="check">
            <input
              type="checkbox"
              checked={value.requestsEnabled}
              onChange={(e) =>
                setValue({ ...value, requestsEnabled: e.target.checked })
              }
            />
            Принимать заявки с сайта
          </label>
          <p>
            Заявки на расчёт и заказы сохраняются в разделе «Заказы». Настройка
            SMTP нужна только для копии на почту: её отсутствие не мешает
            сохранению. Согласие посетителя обязательно. Этот переключатель не
            подтверждает юридическую готовность оператора.
          </p>
        </div>
        <div className="privacy-check">
          <h3>Перед запуском сбора персональных данных</h3>
          <p>
            Заполните юридический адрес, контакт для обращений, фактическое
            место первичной базы в РФ, сведения о подрядчиках и срок хранения.
            Проверьте договоры с хостингом, локализацию и обязанности
            уведомления Роскомнадзора, а при применимости — условия
            трансграничной передачи. Внешняя база Supabase не становится
            российской от изменения этого текста.
          </p>
          <label className="check">
            <input
              type="checkbox"
              checked={value.privacyReady}
              onChange={(e) =>
                setValue({ ...value, privacyReady: e.target.checked })
              }
            />
            Подтверждаю достоверность сведений и готовность оператора принимать
            персональные данные в соответствии с применимыми требованиями.
          </label>
          <p>
            Готовность документов и приём заявок настраиваются отдельно. Если
            сведения ещё не подтверждены, на страницах документов виден статус
            уточнения. Cookie-баннер не заменяет обязанности оператора.
          </p>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="success" role="status">
            {notice}
          </p>
        )}
        <button type="submit" disabled={busy || !loaded}>
          {busy ? "Сохраняем…" : "Сохранить настройки сайта"}
        </button>
      </form>
    </section>
  );
}
