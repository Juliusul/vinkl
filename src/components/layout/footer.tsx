import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("common.nav");
  const tLegal = useTranslations("common.legal");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-default bg-bg-warm">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-12 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-ink-primary">
              <span className="text-terracotta">V</span>INKL
            </p>
          </div>

          {/* Navigation */}
          <div>
            <nav className="flex flex-col gap-3" aria-label="Footer">
              <Link
                href="/objects"
                className="text-sm text-ink-secondary transition-colors duration-[--duration-fast] hover:text-ink-primary"
              >
                {t("objects")}
              </Link>
              <Link
                href="/journal"
                className="text-sm text-ink-secondary transition-colors duration-[--duration-fast] hover:text-ink-primary"
              >
                {t("journal")}
              </Link>
              <Link
                href="/about"
                className="text-sm text-ink-secondary transition-colors duration-[--duration-fast] hover:text-ink-primary"
              >
                {t("about")}
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <nav className="flex flex-col gap-3" aria-label="Legal">
              <Link
                href="/legal/imprint"
                className="text-sm text-ink-secondary transition-colors duration-[--duration-fast] hover:text-ink-primary"
              >
                {tLegal("imprint")}
              </Link>
              <Link
                href="/legal/privacy"
                className="text-sm text-ink-secondary transition-colors duration-[--duration-fast] hover:text-ink-primary"
              >
                {tLegal("privacy")}
              </Link>
              <Link
                href="/legal/terms"
                className="text-sm text-ink-secondary transition-colors duration-[--duration-fast] hover:text-ink-primary"
              >
                {tLegal("terms")}
              </Link>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border-default pt-6">
          <p className="text-xs text-ink-tertiary">
            &copy; {year} VINKL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
