import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * About Vision — what comes next.
 *
 * Same layout grammar, but this section shifts tone:
 * forward-looking, resolute, no hype.
 */
export function AboutVision() {
  const t = useTranslations("about.vision");

  return (
    <section className="px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
            {t("label")}
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.15] tracking-tight">
                {t("heading")}
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="text-base leading-[1.7] text-ink-secondary md:text-lg md:leading-[1.75]">
                {t("body")}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
