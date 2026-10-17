"use client";
import { useState } from "react";
import { useSite } from "./SiteProvider";
import { SiteImage } from "./SiteImage";
import { phoneHref } from "../../lib/site-config";
export function ContactLocation() {
  const { settings } = useSite(),
    [status, setStatus] = useState(""),
    f = settings.fields;
  return (
    <section className="csb-location" aria-label="Как нас найти">
      {settings.images["location-plan"] ? (
        <SiteImage
          slot="location-plan"
          alt="Схема проезда, предоставленная оператором"
        />
      ) : (
        <svg
          width="110"
          height="110"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M50 90S18 60 18 37a32 32 0 0 1 64 0C82 60 50 90 50 90Z"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle
            cx="50"
            cy="37"
            r="11"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      )}
      <h2>Как нас найти</h2>
      <p>{f.address}</p>
      <p>{f.directions}</p>
      <p>Склад: {f.warehouseHours}</p>
      <a href={phoneHref(f.phone1)}>{f.phone1}</a>
      <button
        type="button"
        className="csb-primary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(f.address);
            setStatus("Адрес скопирован");
          } catch {
            setStatus("Выделите и скопируйте адрес из текста выше");
          }
        }}
      >
        Скопировать адрес
      </button>
      <a href="/oplata-i-dostavka">Условия доставки</a>
      <span role="status">{status}</span>
    </section>
  );
}
