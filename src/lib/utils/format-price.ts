import type { Money } from "@/types";
import type { Locale } from "@/config/i18n";

const localeMap: Record<Locale, string> = {
  de: "de-DE",
  en: "en-GB",
};

/**
 * Format a Money object into a locale-aware price string.
 *
 * Examples:
 *   formatPrice({ amount: "249.00", currencyCode: "EUR" }, "de") → "249,00 €"
 *   formatPrice({ amount: "249.00", currencyCode: "EUR" }, "en") → "€249.00"
 */
export function formatPrice(money: Money, locale: Locale): string {
  return new Intl.NumberFormat(localeMap[locale], {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(money.amount));
}
