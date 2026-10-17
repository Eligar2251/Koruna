import { InquiryButton, SiteText } from "./SiteProvider";
import "./design/calculation-button.css";
export function CalculationButton() {
  return (
    <InquiryButton className="csb-calculation-button tn-atom">
      <span>
        <SiteText id="7b1b15a5e608" fallback="Получить расчет" />
      </span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 12h14m-5-5 5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </InquiryButton>
  );
}
