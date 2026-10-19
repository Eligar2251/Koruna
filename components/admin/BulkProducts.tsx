"use client";
import { useState } from "react";
import { adminApi } from "./api";
import { MediaUpload } from "./MediaUpload";
export type BulkProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  unit: string | null;
  price: number | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  in_stock: boolean;
  sort_order: number;
  stock_quantity?: number | null;
};
const columns: Array<[string, string]> = [
  ["name", "Название"],
  ["slug", "Адрес (slug)"],
  ["sku", "Артикул"],
  ["price", "Цена, ₽"],
  ["unit", "Единица"],
  ["description", "Описание"],
  ["sort_order", "Порядок"],
];
export function BulkProducts({
  products,
  categories,
  reload,
}: {
  products: BulkProduct[];
  categories: Array<{ id: string; name: string }>;
  reload: () => Promise<void>;
}) {
  const [selected, setSelected] = useState<string[]>([]),
    [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>({}),
    [query, setQuery] = useState(""),
    [field, setField] = useState("price"),
    [common, setCommon] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const visible = products.filter((p) =>
    `${p.name} ${p.sku || ""}`.toLowerCase().includes(query.toLowerCase()),
  );
  function patch(id: string, key: string, value: unknown) {
    if (!selected.includes(id)) {
      if (selected.length >= 100) {
        setError("Можно редактировать до 100 товаров в одном пакете");
        return;
      }
      setSelected([...selected, id]);
    }
    setDrafts((old) => ({ ...old, [id]: { ...old[id], [key]: value } }));
  }
  function apply(value: unknown, key = field) {
    if (!selected.length) {
      setError("Выберите товары");
      return;
    }
    setDrafts((old) => {
      const next = { ...old };
      for (const id of selected) next[id] = { ...next[id], [key]: value };
      return next;
    });
    setNotice(
      `Изменения подготовлены для ${selected.length} товаров. Проверьте таблицу и сохраните пакет.`,
    );
  }
  async function save() {
    if (!selected.length) return;
    if (
      !confirm(`Сохранить изменения ${selected.length} товаров одним пакетом?`)
    )
      return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await adminApi("/api/admin/products/bulk", {
        method: "PATCH",
        body: JSON.stringify({
          updates: selected.map((id) => ({ id, patch: drafts[id] || {} })),
        }),
      });
      setDrafts((old) =>
        Object.fromEntries(
          Object.entries(old).filter(([id]) => !selected.includes(id)),
        ),
      );
      setSelected([]);
      await reload();
      setNotice(`Обновлено товаров: ${result.updated}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка пакета");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="panel bulk-products">
      <h2>Массовое редактирование</h2>
      <p className="lead">
        Выберите до 100 товаров. Меняйте каждую строку или применяйте одно
        поле/фото ко всем выбранным. Пакет сохраняется атомарно: при ошибке ни
        один товар не меняется. Остатки ведутся отдельно на складе.
      </p>
      <div className="toolbar">
        <input
          aria-label="Поиск массового редактора"
          placeholder="Название или артикул"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="ghost"
          onClick={() => setSelected(visible.slice(0, 100).map((p) => p.id))}
        >
          Выбрать первые {Math.min(visible.length, 100)}
        </button>
        <button type="button" className="ghost" onClick={() => setSelected([])}>
          Снять выбор
        </button>
      </div>
      <div className="bulk-common">
        <label>
          Общее изменение
          <select
            value={field}
            onChange={(e) => {
              setField(e.target.value);
              setCommon("");
            }}
          >
            {[
              ...columns,
              ["category_id", "Категория"],
              ["is_active", "Публикация"],
              ["in_stock", "Наличие"],
            ].map(([key, title]) => (
              <option key={key} value={key}>
                {title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Новое значение
          {field === "category_id" ? (
            <select value={common} onChange={(e) => setCommon(e.target.value)}>
              <option value="">Без категории</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : ["is_active", "in_stock"].includes(field) ? (
            <select value={common} onChange={(e) => setCommon(e.target.value)}>
              <option value="">Выберите</option>
              <option value="true">Да</option>
              <option value="false">Нет</option>
            </select>
          ) : (
            <textarea
              rows={1}
              value={common}
              onChange={(e) => setCommon(e.target.value)}
            />
          )}
        </label>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            if (["is_active", "in_stock"].includes(field) && !common) {
              setError("Укажите значение");
              return;
            }
            apply(
              ["is_active", "in_stock"].includes(field)
                ? common === "true"
                : field === "category_id"
                  ? common || null
                  : common,
            );
          }}
        >
          Применить выбранным
        </button>
        <div>
          <MediaUpload
            label="Общее фото выбранным"
            onUploaded={(url) => apply(url, "image_url")}
          />
          <button
            type="button"
            className="ghost"
            onClick={() => apply(null, "image_url")}
          >
            Убрать фото выбранным
          </button>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Выбор</th>
              {columns.map(([key, title]) => (
                <th key={key}>{title}</th>
              ))}
              <th>Категория</th>
              <th>Фото</th>
              <th>Публикация</th>
              <th>Наличие</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => {
              const row = { ...p, ...drafts[p.id] };
              return (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Выбрать ${p.name}`}
                      checked={selected.includes(p.id)}
                      disabled={
                        !selected.includes(p.id) && selected.length >= 100
                      }
                      onChange={(e) =>
                        setSelected(
                          e.target.checked
                            ? [...selected, p.id]
                            : selected.filter((id) => id !== p.id),
                        )
                      }
                    />
                  </td>
                  {columns.map(([key, title]) => (
                    <td key={key}>
                      <textarea
                        rows={key === "description" ? 3 : 1}
                        aria-label={`${title}: ${p.name}`}
                        value={String(
                          (row as Record<string, unknown>)[key] ?? "",
                        )}
                        onChange={(e) => {
                          patch(p.id, key, e.target.value);
                          if (!selected.includes(p.id) && selected.length < 100)
                            setSelected([...selected, p.id]);
                        }}
                      />
                    </td>
                  ))}
                  <td>
                    <select
                      aria-label={`Категория: ${p.name}`}
                      value={String(row.category_id || "")}
                      onChange={(e) =>
                        patch(p.id, "category_id", e.target.value || null)
                      }
                    >
                      <option value="">Без категории</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {row.image_url && (
                      <img src={String(row.image_url)} alt="" />
                    )}
                    <MediaUpload
                      onUploaded={(url) => patch(p.id, "image_url", url)}
                    />
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => patch(p.id, "image_url", null)}
                    >
                      Убрать
                    </button>
                  </td>
                  {["is_active", "in_stock"].map((key) => (
                    <td key={key}>
                      <input
                        type="checkbox"
                        aria-label={`${key}: ${p.name}`}
                        checked={Boolean((row as Record<string, unknown>)[key])}
                        disabled={
                          key === "in_stock" && p.stock_quantity != null
                        }
                        onChange={(e) => patch(p.id, key, e.target.checked)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bulk-actions">
        <strong>Выбрано: {selected.length} / 100</strong>
        <button
          type="button"
          disabled={busy || !selected.length}
          onClick={save}
        >
          {busy ? "Сохраняем пакет…" : "Сохранить выбранные"}
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            if (confirm("Отменить несохранённые изменения?")) {
              setDrafts({});
              setNotice("Изменения отменены");
            }
          }}
        >
          Отменить изменения
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            const data = selected.map((id) => ({
              id,
              patch: {
                ...products.find((p) => p.id === id),
                ...drafts[id],
                id: undefined,
                stock_quantity: undefined,
              },
            }));
            const url = URL.createObjectURL(
              new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
              }),
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = "products.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Экспорт JSON
        </button>
        <label>
          Импорт JSON
          <input
            type="file"
            accept="application/json,.json"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                if (file.size > 4 * 1024 * 1024)
                  throw new Error("Файл до 4 МБ");
                const rows = JSON.parse(await file.text());
                if (
                  !Array.isArray(rows) ||
                  !rows.length ||
                  rows.length > 100 ||
                  rows.some(
                    (r) =>
                      !products.some((p) => p.id === r.id) ||
                      !r.patch ||
                      typeof r.patch !== "object",
                  )
                )
                  throw new Error(
                    "Нужен массив до 100 строк {id, patch} с существующими товарами",
                  );
                setSelected(rows.map((r) => r.id));
                setDrafts(Object.fromEntries(rows.map((r) => [r.id, r.patch])));
                setNotice("Импорт подготовлен. Проверьте и сохраните пакет.");
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Некорректный файл",
                );
              } finally {
                e.target.value = "";
              }
            }}
          />
        </label>
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
    </section>
  );
}
