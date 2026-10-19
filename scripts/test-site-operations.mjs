import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { createFileStore } from "../server/store.mjs";
import {
  fileSettings,
  validateSettings,
  safeImage,
} from "../server/settings.mjs";
import { buildInquiry, consentRecord } from "../server/requests.mjs";
import {
  mergeSiteSettings,
  requestIntakeEnabled,
} from "../server/intake-config.mjs";

const fields = {
  short: "ЦСБ",
  full: "Центральная Строительная База",
  phone1: "+79991234567",
  phone2: "",
  email: "operator@example.ru",
  privacyEmail: "privacy@example.ru",
  legalFull: "Тестовый оператор",
  inn: "123",
  ogrn: "456",
  legalAddress: "Тестовый адрес",
  storageLocation: "Тестовая база в РФ",
  processors: "Тестовые сведения",
  retention: "Тестовый срок",
  policyDate: "17.10.2026",
};
const defaults = {
  fields,
  content: {},
  images: {},
  privacyReady: false,
  revision: "",
};

test("настройки: валидация, запрет чужих фото, конфликт версий и отсутствие скрытых полей", async () => {
  const value = validateSettings(
    {
      ...defaults,
      fields: { ...fields, hidden_secret: "не должно сохраняться" },
      privacyReady: true,
    },
    defaults,
  );
  assert.equal(value.fields.hidden_secret, undefined);
  assert.equal(value.privacyReady, true);
  assert.equal(safeImage("/assets/catalog/sheets.jpg"), true);
  assert.equal(safeImage("https://evil.example/image.png"), false);
  assert.equal(safeImage("/uploads/../.env"), false);
  assert.equal(safeImage("javascript:alert(1)"), false);
  assert.throws(() =>
    validateSettings(
      {
        ...defaults,
        fields: { ...fields, legalAddress: "" },
        privacyReady: true,
      },
      defaults,
    ),
  );
  const dir = await mkdtemp(path.join(tmpdir(), "csb-settings-"));
  try {
    const store = fileSettings(path.join(dir, "settings.json"), defaults);
    await store.save(value, "");
    await assert.rejects(() => store.save(value, ""), /уже изменены/);
    assert.equal((await store.read()).revision, value.revision);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("обращения не принимаются без настройки, отдельного согласия и актуальной версии", () => {
  const body = {
    name: "Иван",
    phone: "79991234567",
    comment: "Нужна доставка",
    consent: true,
    consent_version: "17.10.2026:revision",
  };
  assert.equal(buildInquiry(body).items.length, 0);
  assert.equal(buildInquiry(body).request_kind, "inquiry");
  assert.throws(() => consentRecord(body, defaults), /приостановлен/);
  const settings = { ...defaults, privacyReady: true, revision: "revision" };
  assert.throws(
    () => consentRecord({ ...body, consent: false }, settings),
    /согласие/,
  );
  assert.throws(
    () => consentRecord({ ...body, consent_version: "old" }, settings),
    /обновлена/,
  );
  assert.equal(consentRecord(body, settings).accepted, true);
  assert.throws(() => buildInquiry({ ...body, phone: "abc" }));
});

test("массовая правка атомарна, сохраняет остальные поля, не меняет остатки", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "csb-bulk-"));
  try {
    const store = createFileStore(path.join(dir, "catalog.json"));
    const a = await store.saveProduct({
        name: "Фанера",
        price: 100,
        description: "Описание",
      }),
      b = await store.saveProduct({ name: "ОСП", price: 200 });
    await assert.rejects(() =>
      store.bulkProducts([
        { id: a.id, patch: { price: 150 } },
        { id: b.id, patch: { price: -1 } },
      ]),
    );
    assert.equal((await store.adminList()).products[0].price, 100);
    await assert.rejects(() =>
      store.bulkProducts([{ id: a.id, patch: { slug: b.slug } }]),
    );
    await assert.rejects(() =>
      store.bulkProducts([{ id: a.id, patch: { stock_quantity: 999 } }]),
    );
    assert.deepEqual(
      await store.bulkProducts([
        { id: a.id, patch: { price: 150 } },
        { id: b.id, patch: { name: "ОСП новая" } },
      ]),
      { updated: 2 },
    );
    const list = await store.adminList();
    assert.equal(list.products[0].description, "Описание");
    assert.equal(list.products[0].price, 150);
    assert.equal(list.products[1].name, "ОСП новая");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("SQL: настройки и массовая правка только администратору, заявкам нужны согласие и включённый приём", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('test.user_id',true),'')::uuid $$;`,
    );
    for (const file of [
      "20261017120100_catalog.sql",
      "20261017130000_harden_catalog.sql",
      "20261017140000_orders_staff.sql",
      "20261017150000_inventory.sql",
      "20261017160000_site_operations.sql",
      "20261017170000_staff_roles_mail.sql",
      "20261017180000_request_intake.sql",
    ])
      await db.exec(
        await readFile(
          new URL("../supabase/migrations/" + file, import.meta.url),
          "utf8",
        ),
      );
    const id = "11111111-1111-1111-1111-111111111111",
      product = "22222222-2222-2222-2222-222222222222";
    await db.exec(
      `insert into auth.users values('${id}');insert into public.admin_users(user_id)values('${id}');insert into public.products(id,name,slug,price)values('${product}','Фанера','fanera',100);set test.user_id='${id}';set role authenticated;`,
    );
    await db.exec(
      `select public.save_site_settings('{"privacyReady":true,"revision":"v1"}','');`,
    );
    await assert.rejects(() =>
      db.exec(`select public.save_site_settings('{}','');`),
    );
    const row = {
      id: product,
      name: "Фанера новая",
      slug: "fanera",
      category_id: null,
      sku: null,
      description: "Новое описание",
      price: 150,
      unit: "лист",
      sort_order: 0,
      is_active: true,
      in_stock: true,
      image_url: null,
    };
    await db.query("select public.bulk_update_products($1::jsonb)", [
      JSON.stringify([row]),
    ]);
    assert.equal(
      (await db.query("select price from public.products")).rows[0].price,
      "150.00",
    );
    await assert.rejects(() =>
      db.query("select public.bulk_update_products($1::jsonb)", [
        JSON.stringify([
          { ...row, price: 250 },
          { ...row, id: "33333333-3333-3333-3333-333333333333" },
        ]),
      ]),
    );
    assert.equal(
      (await db.query("select price from public.products")).rows[0].price,
      "150.00",
    );
    await db.exec("reset role;set test.user_id='';set role anon;");
    await assert.rejects(() =>
      db.query("select public.bulk_update_products($1::jsonb)", [
        JSON.stringify([row]),
      ]),
    );
    await assert.rejects(() =>
      db.exec(`select public.save_site_settings('{}','v1')`),
    );
    await assert.rejects(() =>
      db.exec(
        `insert into public.orders(customer_name,phone,items,request_kind) values('Иван','79991234567','[]','inquiry')`,
      ),
    );
    await db.exec(
      `insert into public.orders(customer_name,phone,items,request_kind,consent) values('Иван','79991234567','[]','inquiry','{"accepted":true,"at":"2026-10-17","version":"17.10.2026","revision":"v1"}')`,
    );
    await assert.rejects(() =>
      db.exec(
        `insert into public.orders(customer_name,phone,items,request_kind,consent) values('Иван','79991234567','[]','inquiry','{"accepted":true,"at":"2026-10-17","version":"old","revision":"old"}')`,
      ),
    );
    await assert.rejects(() => db.query("select * from public.orders"));
    await db.exec(
      `reset role;update public.site_settings set config=jsonb_set(config,'{privacyReady}','false');set role anon;`,
    );
    await assert.rejects(() =>
      db.exec(
        `insert into public.orders(customer_name,phone,items,request_kind,consent) values('Иван','79991234567','[]','inquiry','{"accepted":true,"at":"2026-10-17","version":"17.10.2026","revision":"v1"}')`,
      ),
    );
    // An explicit technical opt-in accepts inquiries even while legal details remain unconfirmed.
    await db.exec(
      `reset role;update public.site_settings set config=config || '{"requestsEnabled":true}'::jsonb;set role anon;`,
    );
    await db.exec(
      `insert into public.orders(customer_name,phone,items,request_kind,consent) values('Проверка приёма','+70000000000','[]','inquiry','{"accepted":true,"at":"2026-10-17","version":"17.10.2026","revision":"v1"}')`,
    );
    await assert.rejects(() =>
      db.exec(
        `insert into public.orders(customer_name,phone,items,request_kind,consent) values('Без согласия','+70000000000','[]','inquiry','{"accepted":false,"at":"2026-10-17","version":"17.10.2026","revision":"v1"}')`,
      ),
    );
    await assert.rejects(() =>
      db.exec(
        `insert into public.orders(customer_name,phone,items,request_kind,consent) values('Старая форма','+70000000000','[]','inquiry','{"accepted":true,"at":"2026-10-17","version":"17.10.2026","revision":"stale"}')`,
      ),
    );
    await db.exec(
      `reset role;set test.user_id='${id}';set role authenticated;`,
    );
    assert.equal(
      (await db.query("select count(*)::int as n from public.orders")).rows[0]
        .n,
      2,
    );
    await db.exec(
      `reset role;set test.user_id='33333333-3333-3333-3333-333333333333';set role authenticated;`,
    );
    assert.equal(
      (await db.query("select count(*)::int as n from public.orders")).rows[0]
        .n,
      0,
    );
    await assert.rejects(() =>
      db.exec(`update public.site_settings set config='{}'::jsonb`),
    );
    for (const flag of [false, null, "true"]) {
      await db.exec(`reset role;`);
      await db.query(
        `update public.site_settings set config=config || $1::jsonb`,
        [JSON.stringify({ requestsEnabled: flag, privacyReady: true })],
      );
      await db.exec(`set role anon;`);
      await assert.rejects(() =>
        db.exec(
          `insert into public.orders(customer_name,phone,items,request_kind,consent) values('Выключено','+70000000000','[]','inquiry','{"accepted":true,"at":"2026-10-17","version":"17.10.2026","revision":"v1"}')`,
        ),
      );
    }
    assert.equal(
      (await db.query("select count(*)::int as n from public.site_settings"))
        .rows[0].n,
      1,
    );
  } finally {
    await db.close();
  }
});

test("приём отделён от юридического подтверждения; старые настройки совместимы, явный запрет важнее", () => {
  assert.equal(requestIntakeEnabled({}), false);
  assert.equal(requestIntakeEnabled({ privacyReady: true }), true);
  assert.equal(
    requestIntakeEnabled({ privacyReady: false, requestsEnabled: true }),
    true,
  );
  for (const flag of [false, null, "true", 1])
    assert.equal(
      requestIntakeEnabled({ privacyReady: true, requestsEnabled: flag }),
      false,
    );
  const merged = mergeSiteSettings(
    { privacyReady: true },
    { ...defaults, requestsEnabled: false },
  );
  assert.equal(merged.requestsEnabled, true);
  assert.equal(mergeSiteSettings({}, defaults).requestsEnabled, false);
  assert.equal(merged.fields.phone1, fields.phone1);
  const next = validateSettings(
    {
      ...defaults,
      fields: { ...fields, legalAddress: "", storageLocation: "" },
      requestsEnabled: true,
    },
    defaults,
  );
  assert.equal(next.requestsEnabled, true);
  assert.equal(next.privacyReady, false);
  assert.equal(next.fields.storageLocation, "");
  const body = {
    consent: true,
    consent_version: `${fields.policyDate}:${next.revision}`,
  };
  assert.equal(consentRecord(body, next).accepted, true);
  assert.throws(
    () => consentRecord({ ...body, consent: false }, next),
    /согласие/,
  );
  assert.throws(
    () => consentRecord({ ...body, consent_version: "old" }, next),
    /обновлена/,
  );
  assert.throws(
    () =>
      consentRecord(body, {
        ...next,
        privacyReady: true,
        requestsEnabled: false,
      }),
    /приостановлен/,
  );
});

test("локальные настройки сохраняют включённые формы без подмены юридических сведений", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "csb-intake-"));
  try {
    const store = fileSettings(path.join(dir, "settings.json"), {
      ...defaults,
      requestsEnabled: false,
    });
    assert.equal((await store.read()).requestsEnabled, false);
    const next = validateSettings(
      { ...defaults, requestsEnabled: true },
      defaults,
    );
    await store.save(next, "");
    const read = await store.read();
    assert.equal(read.requestsEnabled, true);
    assert.equal(read.privacyReady, false);
    const legacy = { ...defaults, privacyReady: true };
    const { writeFile } = await import("node:fs/promises");
    await writeFile(path.join(dir, "settings.json"), JSON.stringify(legacy));
    assert.equal((await store.read()).requestsEnabled, true);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("формы и почтовая диагностика используют приём, а не флаг юридической готовности", async () => {
  for (const file of [
    "components/site/SiteProvider.tsx",
    "components/site/PublicTools.tsx",
    "components/pages/korzina/CartView.tsx",
  ]) {
    const source = await readFile(
      new URL("../" + file, import.meta.url),
      "utf8",
    );
    assert.ok(source.includes("settings.requestsEnabled"));
    assert.ok(!source.includes("settings.privacyReady"));
  }
  const editor = await readFile(
    new URL("../components/admin/SiteSettingsEditor.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(editor.includes("value.requestsEnabled"));
  assert.ok(editor.includes("value.privacyReady"));
});
