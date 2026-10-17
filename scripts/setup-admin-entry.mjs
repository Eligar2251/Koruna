import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
const file = new URL("../.env", import.meta.url);
let env = await readFile(file, "utf8").catch(
  () => "SUPABASE_URL=\nSUPABASE_ANON_KEY=\n",
);
const existing = await readFile(
  new URL("../data/jwt.secret", import.meta.url),
  "utf8",
)
  .then((value) => value.trim())
  .catch(() => "");
if (existing && existing.length < 32 && !/^JWT_SECRET=.+/m.test(env))
  throw new Error(
    "Старый JWT-ключ короче 32 символов. Сначала безопасно мигрируйте/сбросьте локальные пароли через CLI; ключ не перезаписан.",
  );
for (const [key, value] of Object.entries({
  ADMIN_PATH: "/" + randomBytes(32).toString("base64url"),
  JWT_SECRET: existing || randomBytes(48).toString("base64url"),
})) {
  const old = env.match(new RegExp("^" + key + "=(.*)$", "m"));
  if (old && old[1].trim()) continue;
  if (old) env = env.replace(old[0], key + "=" + value);
  else env += "\n" + key + "=" + value + "\n";
}
await writeFile(file, env, { mode: 0o600 });
console.log(
  "Секретный адрес ADMIN_PATH и ключ JWT_SECRET сохранены в .env. Значения не выводятся в журнал. Перезапустите сервер; открывайте сайт по адресу из ADMIN_PATH. Не публикуйте .env.",
);
