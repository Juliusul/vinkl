"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Status = "idle" | "sending" | "sent" | "confirmed" | "error";

/**
 * Waitlist signup form — the pre-launch conversion primitive.
 *
 * Double opt-in: POST sends a confirmation email; the confirm route
 * redirects back with ?waitlist=confirmed, which this component picks
 * up on mount to show the final state.
 */
export function WaitlistForm() {
  const t = useTranslations("waitlist");
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // Confirmation landing (?waitlist=confirmed|error) — read once.
  useEffect(() => {
    const state = new URLSearchParams(window.location.search).get("waitlist");
    if (state === "confirmed") setStatus("confirmed");
    if (state === "error") {
      setStatus("error");
      setError(t("errorGeneric"));
    }
  }, [t]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setError(null);

    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(t("errorInvalid"));
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError(t("errorGeneric"));
    }
  }

  if (status === "confirmed") {
    return (
      <p className="border border-border-default bg-bg-warm px-6 py-5 text-sm leading-relaxed text-ink-primary">
        {t("confirmed")}
      </p>
    );
  }

  if (status === "sent") {
    return (
      <p className="border border-border-default bg-bg-warm px-6 py-5 text-sm leading-relaxed text-ink-primary">
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="waitlist-email">
          {t("placeholder")}
        </label>
        <input
          id="waitlist-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          className="h-[52px] flex-1 border border-border-strong bg-transparent px-5 text-base text-ink-primary placeholder:text-ink-secondary focus:border-ink-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="h-[52px] shrink-0 bg-ink-primary px-8 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-[background-color,transform] duration-[--duration-normal] ease-[--ease-out] hover:bg-terracotta active:translate-y-px disabled:opacity-60"
        >
          {status === "sending" ? t("sending") : t("cta")}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-ink-tertiary">
        {t("privacyPrefix")}{" "}
        <Link
          href="/legal/privacy"
          className="underline decoration-border-strong underline-offset-2 transition-colors duration-[--duration-fast] hover:text-ink-primary"
        >
          {t("privacyLink")}
        </Link>
        {t("privacySuffix")}
      </p>
    </form>
  );
}
