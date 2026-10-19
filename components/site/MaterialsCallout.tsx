import { InquiryButton, SiteText } from "./SiteProvider";
import { SiteImage } from "./SiteImage";
import "./design/materials-callout.css";

export function MaterialsCallout() {
  return (
    <section
      className="csb-materials-callout"
      aria-labelledby="materials-callout-title"
    >
      <SiteImage
        className="csb-materials-callout__image"
        src="/_thb.tildacdn.com/tild3462-6636-4264-b065-363639366461/-/resize/20x/photo_2026-03-10_13-.png"
        alt="Строительные материалы на складе"
        width={240}
        height={210}
        loading="lazy"
        decoding="async"
      />
      <div className="csb-materials-callout__text">
        <h2 id="materials-callout-title">
          <SiteText id="3ce55672405b" fallback="Нужны материалы для стройки?" />
        </h2>
        <p>
          <SiteText
            id="b78bd88b02f9"
            fallback="Оставьте заявку прямо сейчас — подготовим расчет стоимости в течение 15 минут"
          />
        </p>
      </div>
      <InquiryButton className="csb-materials-callout__button">
        <SiteText id="7b1b15a5e608" fallback="Получить расчет" />
        <span aria-hidden="true">→</span>
      </InquiryButton>
    </section>
  );
}
