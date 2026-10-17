"use client";
import { useState } from "react";
import { adminApi } from "./api";
export function MediaUpload({
  onUploaded,
  label = "Загрузить фото",
}: {
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <div>
      <label>
        {label}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setError("");
            setBusy(true);
            try {
              if (file.size > 5 * 1024 * 1024)
                throw new Error("Фото не больше 5 МБ");
              const base64 = await new Promise<string>((resolve, reject) => {
                const r = new FileReader();
                r.onload = () => resolve(String(r.result).split(",")[1]);
                r.onerror = () => reject(new Error("Файл не прочитан"));
                r.readAsDataURL(file);
              });
              const data = await adminApi("/api/admin/media", {
                method: "POST",
                body: JSON.stringify({
                  image_type: file.type,
                  image_base64: base64,
                }),
              });
              onUploaded(data.url);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Ошибка загрузки");
            } finally {
              setBusy(false);
              e.target.value = "";
            }
          }}
        />
      </label>
      {busy && <small>Загрузка…</small>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
