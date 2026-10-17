import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import nodemailer from "nodemailer";
import { PGlite } from "@electric-sql/pglite";
import { formatPhone, normalizePhone } from "../server/phone.mjs";
import {
  adminEntry,
  createGateToken,
  verifyGateToken,
} from "../server/admin-gate.mjs";
import {
  createAccountBook,
  readAccess,
  signAccess,
} from "../server/accounts.mjs";
import { createOrderBook } from "../server/orders.mjs";
import {
  mailConfiguration,
  sendRequestEmail,
  requestMessage,
} from "../server/mail.mjs";
process.env.JWT_SECRET = "unit-test-intake-key-at-least-thirty-two-characters";

test("маска +7 и строгая серверная нормализация номера", () => {
  for (const value of ["89991234567", "+7 (999) 123-45-67", "9991234567"]) {
    assert.equal(formatPhone(value), "+7 (999) 123-45-67");
    assert.equal(normalizePhone(value), "+79991234567");
  }
  assert.equal(formatPhone("+7 89991234567"), "+7 (999) 123-45-67");
  assert.equal(formatPhone("8121234567"), "+7 (812) 123-45-67");
  assert.equal(formatPhone("+7 (999) 123-45-6"), "+7 (999) 123-45-6");
  assert.throws(() => normalizePhone("+7 (999) 12"));
  assert.throws(() => normalizePhone("+442012345678"));
});
test("секретный адрес закрыт без env; gate JWT нельзя подделать, просрочить или перенести на другой адрес", async () => {
  const env = { ADMIN_PATH: "/" + "p".repeat(43), JWT_SECRET: "s".repeat(48) };
  assert.equal(adminEntry({}), null);
  assert.equal(adminEntry({ ...env, ADMIN_PATH: "/admin" }), null);
  const token = await createGateToken(env.JWT_SECRET, env.ADMIN_PATH, 1000);
  assert.equal(
    await verifyGateToken(token, env.JWT_SECRET, env.ADMIN_PATH, 1001),
    true,
  );
  assert.equal(
    await verifyGateToken(token + "x", env.JWT_SECRET, env.ADMIN_PATH, 1001),
    false,
  );
  assert.equal(
    await verifyGateToken(token, env.JWT_SECRET, env.ADMIN_PATH + "x", 1001),
    false,
  );
  assert.equal(
    await verifyGateToken(
      token,
      env.JWT_SECRET,
      env.ADMIN_PATH,
      1000 + 12 * 3600,
    ),
    false,
  );
  assert.equal(
    await verifyGateToken(token, "x".repeat(48), env.ADMIN_PATH, 1001),
    false,
  );
  assert.equal(
    await verifyGateToken(token, env.JWT_SECRET, env.ADMIN_PATH, 500),
    false,
  );
});
test("локальные роли: первый владелец, новые админы, защита последнего владельца", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "csb-roles-"));
  try {
    const book = createAccountBook(path.join(dir, "admins.json"));
    const owner = await book.create({
      name: "Владелец",
      email: "owner@example.ru",
      password: "safe-password-12345",
    });
    const admin = await book.create({
      name: "Админ",
      email: "admin@example.ru",
      password: "safe-password-12345",
    });
    assert.equal(owner.role, "owner");
    assert.equal(admin.role, "admin");
    assert.equal(readAccess(signAccess(owner)).role, "owner");
    await assert.rejects(() => book.setRole(owner.id, "admin"));
    await book.setRole(admin.id, "owner");
    await book.setRole(owner.id, "admin");
    assert.equal((await book.byId(admin.id)).role, "owner");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("письмо содержит заявку; TLS обязателен, адреса фиксированы; SMTP-сбой не маскируется успехом", async () => {
  const env = {
    SMTP_HOST: "smtp.example.ru",
    SMTP_PORT: "587",
    SMTP_SECURE: "false",
    SMTP_USER: "robot@example.ru",
    SMTP_PASSWORD: "test-only",
    MAIL_FROM: "robot@example.ru",
    REQUESTS_EMAIL: "manager@example.ru",
  };
  const order = {
    id: "11111111-1111-1111-1111-111111111111",
    request_kind: "inquiry",
    customer_name: "Иван",
    phone: "+79991234567",
    comment: "Нужно 20 листов фанеры",
    email: "customer@example.ru",
    items: [],
  };
  assert.equal(mailConfiguration({}, {}), null);
  let mime = "",
    options;
  const factory = (config) => {
    options = config;
    const transport = nodemailer.createTransport({
      streamTransport: true,
      buffer: true,
    });
    return {
      sendMail: async (message) => {
        assert.equal(message.to, "manager@example.ru");
        assert.equal(message.replyTo, "customer@example.ru");
        const response = await transport.sendMail(message);
        mime = response.message.toString();
        return response;
      },
      close: () => transport.close(),
    };
  };
  assert.equal(await sendRequestEmail(order, {}, env, factory), "sent");
  assert.equal(options.requireTLS, true);
  assert.equal(options.disableFileAccess, true);
  assert.match(requestMessage(order).text, /Нужно 20 листов/);
  assert.match(mime, /Subject:/);
  assert.equal(
    await sendRequestEmail(order, {}, env, () => ({
      sendMail: async () => {
        throw new Error("SMTP rejected");
      },
      close() {},
    })),
    "failed",
  );
  assert.equal(await sendRequestEmail(order, {}, {}), "unconfigured");
});
test("заявка не теряется при сбое почты; подтверждение по capability и повторная отправка защищены", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "csb-mail-state-"));
  try {
    const book = createOrderBook(path.join(dir, "orders.json")),
      saved = await book.add({
        email_status: "pending",
        email_token_hash: "a".repeat(64),
        email_attempted_at: new Date().toISOString(),
        customer_name: "Иван",
      });
    await assert.rejects(() => book.finishEmail(saved.id, "wrong", "sent"));
    await assert.rejects(() => book.claimEmail(saved.id, "b".repeat(64)));
    await book.finishEmail(saved.id, "a".repeat(64), "failed");
    assert.equal((await book.list())[0].customer_name, "Иван");
    await book.claimEmail(saved.id, "b".repeat(64));
    await book.finishEmail(saved.id, "b".repeat(64), "sent");
    await assert.rejects(() => book.claimEmail(saved.id, "c".repeat(64)));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("SQL: владельцев назначает только владелец, аноним не читает заявки и не подделывает доставку", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create schema auth;create table auth.users(id uuid primary key);create function auth.uid()returns uuid language sql as $$select nullif(current_setting('test.user_id',true),'')::uuid$$;`,
    );
    for (const file of [
      "20261017120100_catalog.sql",
      "20261017130000_harden_catalog.sql",
      "20261017140000_orders_staff.sql",
      "20261017150000_inventory.sql",
      "20261017160000_site_operations.sql",
    ])
      await db.exec(
        await readFile(
          new URL("../supabase/migrations/" + file, import.meta.url),
          "utf8",
        ),
      );
    const owner = "11111111-1111-1111-1111-111111111111",
      admin = "22222222-2222-2222-2222-222222222222",
      newOwner = "33333333-3333-3333-3333-333333333333",
      order = "44444444-4444-4444-4444-444444444444";
    await db.exec(
      `insert into auth.users values('${owner}'),('${admin}'),('${newOwner}');insert into public.admin_users(user_id)values('${owner}');`,
    );
    await db.exec(
      await readFile(
        new URL(
          "../supabase/migrations/20261017170000_staff_roles_mail.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await db.exec(
      `set test.user_id='${owner}';set role authenticated;select public.grant_staff('${admin}','admin@example.ru','Администратор','${"x".repeat(32)}','admin');`,
    );
    await assert.rejects(() =>
      db.exec(`select public.set_staff_role('${owner}','admin')`),
    );
    await db.exec(`set test.user_id='${admin}';`);
    await assert.rejects(() =>
      db.exec(
        `select public.grant_staff('${newOwner}','owner@example.ru','Владелец','${"x".repeat(32)}','owner')`,
      ),
    );
    await assert.rejects(() =>
      db.exec(
        `update public.admin_users set role='owner' where user_id='${admin}'`,
      ),
    );
    await db.exec(
      `set test.user_id='${owner}';select public.grant_staff('${newOwner}','owner@example.ru','Владелец','${"x".repeat(32)}','owner');select public.set_staff_role('${owner}','admin');reset role;insert into public.orders(id,customer_name,phone,items,email_status,email_token_hash)values('${order}','Иван','+79991234567','[]','pending','${"a".repeat(64)}');set role anon;`,
    );
    await assert.rejects(() => db.exec("select * from public.orders"));
    await assert.rejects(() =>
      db.exec(
        `select public.finish_request_email('${order}','${"b".repeat(64)}','sent')`,
      ),
    );
    await db.exec(
      `select public.finish_request_email('${order}','${"a".repeat(64)}','sent')`,
    );
    await assert.rejects(() =>
      db.exec(
        `select public.finish_request_email('${order}','${"a".repeat(64)}','failed')`,
      ),
    );
    await db.exec("reset role");
    assert.equal(
      (
        await db.query(
          `select email_status,email_token_hash from public.orders where id='${order}'`,
        )
      ).rows[0].email_status,
      "sent",
    );
  } finally {
    await db.close();
  }
});
