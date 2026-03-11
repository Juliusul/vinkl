"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames } from "@/config/i18n";
import type { Locale } from "@/config/i18n";

/**
 * Language switcher — toggles between DE and EN.
 *
 * Uses next-intl's navigation primitives to switch locale
 * while preserving the current pathname.
 */
export function LocaleSwitcher() {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function handleSwitch(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="flex items-center gap-1" role="navigation" aria-label="Language">
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 && (
            <span className="text-ink-tertiary" aria-hidden="true">
              /
            </span>
          )}
          <button
            onClick={() => handleSwitch(locale)}
            disabled={locale === currentLocale}
            aria-label={localeNames[locale]}
            aria-current={locale === currentLocale ? "true" : undefined}
            className={`text-xs font-medium uppercase tracking-widest transition-colors duration-[--duration-fast] ${
              locale === currentLocale
                ? "text-ink-primary"
                : "text-ink-tertiary hover:text-ink-primary"
            } disabled:cursor-default`}
          >
            {locale}
          </button>
        </span>
      ))}
    </div>
  );
}
