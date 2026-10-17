"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import {
  defaultSettings,
  phoneHref,
  type SiteSettings,
} from "../../lib/site-config";
const Context = createContext({
  settings: defaultSettings,
  inquiry: false,
  setInquiry: (_value: boolean) => {},
});
export function SiteProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  const [inquiry, setInquiry] = useState(false);
  return (
    <Context.Provider value={{ settings, inquiry, setInquiry }}>
      {children}
    </Context.Provider>
  );
}
export const useSite = () => useContext(Context);
export function SiteText({
  id,
  field,
  fallback,
  prefix = "",
  suffix = "",
}: {
  id?: string;
  field?: string;
  fallback: string;
  prefix?: string;
  suffix?: string;
}) {
  const { settings } = useSite();
  return (
    <>
      {field
        ? settings.fields[field] !== undefined
          ? prefix + settings.fields[field] + suffix
          : fallback
        : (settings.content[id || ""] ?? fallback)}
    </>
  );
}
export function SiteLink({
  field,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { field: string }) {
  const { settings } = useSite();
  const value = settings.fields[field] || "";
  return (
    <a
      {...props}
      href={field.startsWith("phone") ? phoneHref(value) : `mailto:${value}`}
    />
  );
}
export function InquiryButton({
  children,
  className,
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  target?: string;
  rel?: string;
}) {
  const { setInquiry } = useSite();
  return (
    <button
      type="button"
      className={className}
      style={style}
      aria-label={
        props["aria-label"] || !children ? "Связаться с менеджером" : undefined
      }
      title="Оставить заявку менеджеру"
      onClick={() => setInquiry(true)}
    >
      {children}
    </button>
  );
}
export function ConsentCheckbox() {
  const { settings } = useSite();
  return (
    <>
      <label className="csb-consent">
        <input type="checkbox" name="consent" required />
        <span>
          Даю отдельное{" "}
          <a href="/soglasie" target="_blank" rel="noopener">
            согласие на обработку персональных данных
          </a>{" "}
          для ответа на обращение и оформления заказа. Ознакомлен(а) с{" "}
          <a href="/privacy" target="_blank" rel="noopener">
            политикой конфиденциальности
          </a>
          .
        </span>
      </label>
      <input
        type="hidden"
        name="consent_version"
        value={`${settings.fields.policyDate}:${settings.revision}`}
        readOnly
      />
      {!settings.privacyReady && (
        <p className="csb-form-note">
          Приём заявок ещё не настроен оператором. Свяжитесь с нами по телефону.
        </p>
      )}
    </>
  );
}
