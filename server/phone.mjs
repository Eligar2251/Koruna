// Formatting is shared by browser inputs and server validation.
export function phoneDigits(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.length > 10 && /^[78]/.test(digits)) digits = digits.slice(1);
  return digits;
}
export function normalizePhone(value) {
  const digits = phoneDigits(value);
  if (!/^\d{10}$/.test(digits))
    throw new Error("Укажите полный номер телефона: +7 (999) 123-45-67");
  return "+7" + digits;
}
export function formatPhone(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (
    String(value).trim().startsWith("+7") ||
    (digits.length === 11 && /^[78]/.test(digits)) ||
    digits === "7" ||
    digits === "8"
  )
    digits = digits.slice(1);
  // Pasting a full 8/7-prefixed number after the fixed +7 prefix must not lose a digit.
  if (digits.length === 11 && /^[78]/.test(digits)) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return "+7";
  let out = "+7 (" + digits.slice(0, 3);
  if (digits.length >= 3) out += ") ";
  if (digits.length > 3) out += digits.slice(3, 6);
  if (digits.length > 6) out += "-" + digits.slice(6, 8);
  if (digits.length > 8) out += "-" + digits.slice(8, 10);
  return out;
}
