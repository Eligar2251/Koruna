"use client";
import { useRef, type InputHTMLAttributes } from "react";
import { formatPhone } from "../../server/phone.mjs";

export function PhoneInput(
  props: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
  >,
) {
  const composing = useRef(false);
  return (
    <input
      {...props}
      type="tel"
      name={props.name || "phone"}
      inputMode="tel"
      autoComplete="tel"
      placeholder="+7 (___) ___-__-__"
      maxLength={18}
      pattern={String.raw`\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}`}
      title="Введите номер полностью: +7 (999) 123-45-67"
      onCompositionStart={() => {
        composing.current = true;
      }}
      onCompositionEnd={(e) => {
        composing.current = false;
        e.currentTarget.value = formatPhone(e.currentTarget.value);
      }}
      onFocus={(e) => {
        if (!e.currentTarget.value) e.currentTarget.value = "+7 ";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        if (!/\d{2}/.test(e.currentTarget.value.replace(/\D/g, "")))
          e.currentTarget.value = "";
        props.onBlur?.(e);
      }}
      onKeyDown={(e) => {
        const input = e.currentTarget,
          start = input.selectionStart || 0;
        if (
          e.key === "Backspace" &&
          start === input.selectionEnd &&
          start > 3 &&
          /\D/.test(input.value[start - 1])
        ) {
          e.preventDefault();
          const preceding = input.value.slice(0, start).replace(/\D+$/, "");
          input.value = formatPhone(
            preceding.slice(0, -1) + input.value.slice(start),
          );
          const caret = Math.max(3, preceding.length - 1);
          input.setSelectionRange(caret, caret);
        }
        props.onKeyDown?.(e);
      }}
      onChange={(e) => {
        if (composing.current) return;
        const input = e.currentTarget,
          old = input.value,
          cursor = input.selectionStart || old.length;
        const digitsBefore = old.slice(0, cursor).replace(/\D/g, "").length;
        input.value = formatPhone(old);
        if (cursor < old.length) {
          let count = 0,
            caret = input.value.length;
          for (let i = 0; i < input.value.length; i++)
            if (/\d/.test(input.value[i]) && ++count === digitsBefore) {
              caret = i + 1;
              break;
            }
          input.setSelectionRange(caret, caret);
        }
      }}
    />
  );
}
