import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";

/**
 * Journal article: "Winkel messen, Winkel verstehen".
 *
 * The teaser promises "Kein Verkaufstext" — the article keeps that
 * promise. A genuinely useful guide, editorial prose layout, no CTA
 * push. The SEO entry point for the exact problem VINKL solves.
 */

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "journal.measure.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

const SECTIONS = ["s1", "s2", "s3", "s4"] as const;

export default async function MeasureAnglesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "journal.measure" });
  const tJournal = await getTranslations({ locale, namespace: "journal" });

  return (
    <article className="px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto w-full max-w-[680px]">
        {/* Kicker */}
        <Reveal>
          <p className="section-label text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
            {t("tag")}
          </p>
          <h1 className="mt-6 font-heading text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.12] tracking-tight text-ink-primary [text-wrap:balance]">
            {t("title")}
          </h1>
          <p className="mt-8 font-serif text-lg font-light leading-[1.65] text-ink-secondary md:text-xl [text-wrap:pretty]">
            {t("intro")}
          </p>
        </Reveal>

        {/* Sections */}
        <div className="mt-14 md:mt-16">
          {SECTIONS.map((key) => (
            <Reveal key={key}>
              <section className="border-t border-border-default py-10 md:py-12">
                <h2 className="font-heading text-xl font-normal tracking-tight text-ink-primary md:text-2xl">
                  {t(`${key}heading`)}
                </h2>
                <p className="mt-4 text-base leading-[1.75] text-ink-secondary [text-wrap:pretty]">
                  {t(`${key}body`)}
                </p>
              </section>
            </Reveal>
          ))}
        </div>

        {/* Closing */}
        <Reveal>
          <p className="border-t-2 border-terracotta pt-8 font-serif text-xl font-light leading-[1.5] text-ink-primary md:text-2xl [text-wrap:balance]">
            {t("closing")}
          </p>
        </Reveal>

        {/* Back link */}
        <Reveal>
          <div className="mt-14 border-t border-border-default pt-8">
            <Link
              href="/journal"
              className="text-xs font-medium uppercase tracking-widest text-ink-tertiary transition-colors duration-[--duration-fast] hover:text-ink-primary"
            >
              &larr; {tJournal("backToJournal")}
            </Link>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
