export const GATE_COOKIE = "csb_admin_gate";
export function adminEntry(env = process.env) {
  const entry = env.ADMIN_PATH || "";
  if (
    !/^\/[A-Za-z0-9_-]{32,128}$/.test(entry) ||
    (env.JWT_SECRET || "").length < 32
  )
    return null;
  return entry;
}
function encode(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  return btoa(String.fromCharCode(...bytes))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
async function key(secret, usage) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}
export async function createGateToken(
  secret,
  entry,
  now = Math.floor(Date.now() / 1000),
) {
  const content = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ typ: "admin-gate", aud: entry, iat: now, exp: now + 12 * 3600 })}`;
  const signature = await crypto.subtle.sign(
    "HMAC",
    await key(secret, "sign"),
    new TextEncoder().encode(content),
  );
  return (
    content +
    "." +
    btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
  );
}
export async function verifyGateToken(
  token,
  secret,
  entry,
  now = Math.floor(Date.now() / 1000),
) {
  if (
    !entry ||
    !secret ||
    secret.length < 32 ||
    typeof token !== "string" ||
    token.length > 2048
  )
    return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const decode = (value) =>
      Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
        c.charCodeAt(0),
      );
    const header = JSON.parse(new TextDecoder().decode(decode(parts[0])));
    const payload = JSON.parse(new TextDecoder().decode(decode(parts[1])));
    if (
      header.alg !== "HS256" ||
      header.typ !== "JWT" ||
      payload.typ !== "admin-gate" ||
      payload.aud !== entry ||
      !Number.isInteger(payload.exp) ||
      payload.exp <= now ||
      !Number.isInteger(payload.iat) ||
      payload.iat > now + 30 ||
      payload.exp - payload.iat > 12 * 3600
    )
      return false;
    return crypto.subtle.verify(
      "HMAC",
      await key(secret, "verify"),
      decode(parts[2]),
      new TextEncoder().encode(parts[0] + "." + parts[1]),
    );
  } catch {
    return false;
  }
}
