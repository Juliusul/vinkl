"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_KEY = "vinkl-cookie-consent";
const CONSENT_VERSION = "1";

function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed.consent;
  } catch {
    return null;
  }
}

function storeConsent(consent: ConsentState) {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ version: CONSENT_VERSION, consent, timestamp: Date.now() })
  );
}

/**
 * Dispatches a custom event so tracking scripts can react to consent changes.
 */
function dispatchConsentEvent(consent: ConsentState) {
  window.dispatchEvent(
    new CustomEvent("vinkl:consent", { detail: consent })
  );
}

export function CookieConsent() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setConsent(stored);
      dispatchConsentEvent(stored);
    } else {
      setVisible(true);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const full: ConsentState = { essential: true, analytics: true, marketing: true };
    setConsent(full);
    storeConsent(full);
    dispatchConsentEvent(full);
    setVisible(false);
  }, []);

  const acceptEssential = useCallback(() => {
    const minimal: ConsentState = { essential: true, analytics: false, marketing: false };
    setConsent(minimal);
    storeConsent(minimal);
    dispatchConsentEvent(minimal);
    setVisible(false);
  }, []);

  const saveSelection = useCallback(() => {
    storeConsent(consent);
    dispatchConsentEvent(consent);
    setVisible(false);
  }, [consent]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-[640px] border border-border-default bg-bg-cream shadow-lg">
        <div className="p-5 md:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            {t("title")}
          </p>

          <p className="mt-3 text-sm leading-[1.7] text-ink-secondary">
            {t("body")}{" "}
            <Link
              href="/legal/privacy"
              className="text-ink-primary underline underline-offset-2"
            >
              {t("privacyLink")}
            </Link>
            .
          </p>

          {showDetails && (
            <div className="mt-5 space-y-3 border-t border-border-default pt-5">
              {/* Essential */}
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-ink-primary">
                    {t("essential")}
                  </span>
                  <span className="ml-2 text-[11px] text-ink-tertiary">
                    {t("alwaysActive")}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 accent-terracotta"
                />
              </label>

              {/* Analytics */}
              <label className="flex cursor-pointer items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-ink-primary">
                    {t("analytics")}
                  </span>
                  <span className="ml-2 text-[11px] text-ink-tertiary">
                    Google Analytics, Vercel Analytics, Hotjar
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={consent.analytics}
                  onChange={(e) =>
                    setConsent((c) => ({ ...c, analytics: e.target.checked }))
                  }
                  className="h-4 w-4 accent-terracotta"
                />
              </label>

              {/* Marketing */}
              <label className="flex cursor-pointer items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-ink-primary">
                    {t("marketing")}
                  </span>
                  <span className="ml-2 text-[11px] text-ink-tertiary">
                    Meta Pixel, Google Tag Manager
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={consent.marketing}
                  onChange={(e) =>
                    setConsent((c) => ({ ...c, marketing: e.target.checked }))
                  }
                  className="h-4 w-4 accent-terracotta"
                />
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button
                onClick={acceptAll}
                className="bg-ink-primary px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-colors duration-[--duration-fast] hover:bg-terracotta"
              >
                {t("acceptAll")}
              </button>
              <button
                onClick={acceptEssential}
                className="border border-ink-primary px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-ink-primary transition-colors duration-[--duration-fast] hover:bg-ink-primary hover:text-ink-inverse"
              >
                {t("essentialOnly")}
              </button>
            </div>
            {!showDetails ? (
              <button
                onClick={() => setShowDetails(true)}
                className="text-xs text-ink-tertiary underline underline-offset-2 transition-colors hover:text-ink-primary"
              >
                {t("settings")}
              </button>
            ) : (
              <button
                onClick={saveSelection}
                className="text-xs text-ink-tertiary underline underline-offset-2 transition-colors hover:text-ink-primary"
              >
                {t("saveSelection")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
