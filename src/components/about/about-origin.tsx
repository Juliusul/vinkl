import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * About Origin — why VINKL exists.
 *
 * Asymmetric split. Label + heading left, body right.
 * Three short paragraphs with air between them.
 * Not a founder story. A problem statement.
 */
export function AboutOrigin() {
  const t = useTranslations("about.origin");

  return (
    <section className="px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
            {t("label")}
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12 lg:gap-16">
          {/* Heading — left */}
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.15] tracking-tight">
                {t("heading")}
              </h2>
            </Reveal>
          </div>

          {/* Body — right, three short paragraphs */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal stagger>
              <p className="reveal-child text-base leading-[1.7] text-ink-secondary md:text-lg md:leading-[1.75]">
                {t("body1")}
              </p>
              <p className="reveal-child mt-5 text-base leading-[1.7] text-ink-secondary md:text-lg md:leading-[1.75]">
                {t("body2")}
              </p>
              <p className="reveal-child mt-5 text-base leading-[1.7] text-ink-primary md:text-lg md:leading-[1.75]">
                {t("body3")}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
