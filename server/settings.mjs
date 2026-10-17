import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
let queue = Promise.resolve();
export function validateSettings(body, defaults, remoteUrl = "") {
  const next = {
    fields: {},
    content: {},
    images: {},
    privacyReady: body.privacyReady === true,
    revision: randomUUID(),
  };
  if (
    !body.fields ||
    typeof body.fields !== "object" ||
    Array.isArray(body.fields)
  )
    throw new Error("Укажите настройки сайта");
  for (const key of Object.keys(defaults.fields)) {
    const value = body.fields[key] ?? defaults.fields[key];
    if (typeof value !== "string" || value.length > 4000)
      throw new Error("Некорректное поле: " + key);
    next.fields[key] = value.trim();
  }
  for (const key of ["short", "full", "phone1", "email"])
    if (!next.fields[key]) throw new Error("Укажите обязательное поле: " + key);
  for (const key of ["email", "privacyEmail"])
    if (
      next.fields[key] &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.fields[key])
    )
      throw new Error("Некорректная почта");
  for (const key of ["phone1", "phone2"])
    if (next.fields[key] && !/^[+\d ()–-]{6,40}$/.test(next.fields[key]))
      throw new Error("Некорректный телефон");
  for (const section of ["content", "images"]) {
    const source = body[section] || {};
    if (
      typeof source !== "object" ||
      Array.isArray(source) ||
      Object.keys(source).length > 2000
    )
      throw new Error("Некорректные данные сайта");
    for (const [key, value] of Object.entries(source)) {
      if (
        typeof value !== "string" ||
        key.length > 1000 ||
        value.length > (section === "content" ? 12000 : 2000) ||
        ["__proto__", "constructor", "prototype"].includes(key)
      )
        throw new Error("Некорректные данные сайта");
      if (section === "images" && value && !safeImage(value, remoteUrl))
        throw new Error("Некорректный адрес изображения");
      if (section === "content" || value) next[section][key] = value;
    }
  }
  if (next.privacyReady)
    for (const key of [
      "legalFull",
      "inn",
      "ogrn",
      "legalAddress",
      "privacyEmail",
      "storageLocation",
      "processors",
      "retention",
      "policyDate",
    ])
      if (!next.fields[key])
        throw new Error("Для публикации политики укажите: " + key);
  if (next.fields.policyDate.length > 100)
    throw new Error("Некорректная дата редакции");
  return next;
}
export function safeImage(value, remoteUrl = "") {
  if (
    typeof value !== "string" ||
    value.includes("..") ||
    /[\\\s<>"']/u.test(value)
  )
    return false;
  if (
    /^\/(?:uploads|assets|_static\.tildacdn\.com|_thb\.tildacdn\.com)\/[a-zA-Z0-9_./-]+$/.test(
      value,
    )
  )
    return true;
  return Boolean(
    remoteUrl &&
    value.startsWith(
      remoteUrl.replace(/\/$/, "") +
        "/storage/v1/object/public/product-images/",
    ) &&
    /^[a-zA-Z0-9_.-]+$/.test(value.split("/").at(-1)),
  );
}
export function fileSettings(file, defaults) {
  return {
    async read() {
      try {
        const data = JSON.parse(await readFile(file, "utf8"));
        return {
          ...defaults,
          ...data,
          fields: { ...defaults.fields, ...data.fields },
        };
      } catch (err) {
        if (err.code === "ENOENT") return structuredClone(defaults);
        throw err;
      }
    },
    save(next, expected) {
      const run = queue.then(async () => {
        const current = await this.read();
        if (current.revision !== expected)
          throw new Error(
            "Настройки уже изменены. Обновите страницу перед сохранением.",
          );
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file + ".tmp", JSON.stringify(next, null, 2));
        await rename(file + ".tmp", file);
        return next;
      });
      queue = run.catch(() => {});
      return run;
    },
  };
}
