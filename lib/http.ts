import { NextResponse } from "next/server";
import { SupabaseDataError } from "../server/supabase-errors.mjs";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "same-origin",
    },
  });
}

export function fail(err: unknown) {
  if (err instanceof SupabaseDataError)
    return json({ error: err.message, code: err.code }, err.status);
  const message = err instanceof Error ? err.message : "Ошибка";
  const status = /слишком большой запрос/i.test(message)
    ? 413
    : /уже изменены|политика обновлена/i.test(message)
      ? 409
      : /приём заявок|настройки недоступны|не удалось сохранить заявку/i.test(
            message,
          )
        ? 503
        : /не найден/i.test(message)
          ? 404
          : /уже есть|укажите|некоррект|длиннее|адрес|согласие|пакет|от 1 до|для публикации/i.test(
                message,
              )
            ? 400
            : 500;
  return json({ error: message }, status);
}

export async function readJson(req: Request, limit = 8 * 1024 * 1024) {
  if (Number(req.headers.get("content-length")) > limit)
    throw new Error("Слишком большой запрос");
  const reader = req.body?.getReader();
  if (!reader) return {};
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new Error("Слишком большой запрос");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return {};
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Некорректный JSON");
  }
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new Error("Некорректный JSON: нужен объект");
  return data as Record<string, unknown>;
}

const ID = /^[0-9a-f-]{36}$/;

export function validId(id: string) {
  return ID.test(id);
}
