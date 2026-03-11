import { useTranslations } from "next-intl";

/**
 * Journal Hero — the opening statement.
 *
 * Large serif heading + single intro paragraph.
 * Feels like the masthead of a design publication,
 * not the top of a company blog.
 */
export function JournalHero() {
  const t = useTranslations("journal.hero");

  return (
    <section className="px-5 pb-12 pt-24 md:px-10 md:pb-16 md:pt-32 lg:px-16 lg:pt-40">
      <div className="mx-auto w-full max-w-[1200px]">
        <h1 className="max-w-[900px] font-serif text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1.1] tracking-tight text-ink-primary">
          {t("heading")}
        </h1>

        <p className="mt-8 max-w-[540px] text-base leading-[1.75] text-ink-secondary md:mt-10 md:text-lg">
          {t("intro")}
        </p>
      </div>
    </section>
  );
}
