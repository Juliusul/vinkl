import { useTranslations } from "next-intl";

/**
 * About Hero — the manifesto opener.
 *
 * Two-line serif statement. Full viewport presence.
 * No image. The words are the architecture.
 */
export function AboutHero() {
  const t = useTranslations("about.hero");

  return (
    <section className="flex min-h-[60vh] flex-col justify-end px-5 pb-16 pt-24 md:px-10 md:pb-20 md:pt-32 lg:px-16 lg:pb-24 lg:pt-40">
      <div className="mx-auto w-full max-w-[1200px]">
        <h1 className="font-serif text-[clamp(2.25rem,5.5vw,4.5rem)] font-light leading-[1.08] tracking-tight text-ink-primary">
          <span className="block">{t("heading")}</span>
          <span className="block">{t("headingLine2")}</span>
        </h1>
      </div>
    </section>
  );
}
