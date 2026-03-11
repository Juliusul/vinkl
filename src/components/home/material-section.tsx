import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * Material — teak.
 *
 * Inverted section (dark background). Text only.
 */
export function MaterialSection() {
  const t = useTranslations("home.material");

  return (
    <section className="border-t-2 border-terracotta bg-bg-deep px-5 py-16 text-ink-inverse md:px-10 md:py-24 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="section-label section-label-inverse text-xs font-medium uppercase tracking-[0.15em] text-ink-inverse/50">
            {t("label")}
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="font-serif text-[clamp(3rem,7vw,6.5rem)] font-light leading-none tracking-tight">
                {t("heading")}
              </h2>
            </Reveal>
          </div>

          <div className="flex items-end lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="max-w-md text-base leading-[1.7] text-ink-inverse/70 md:text-lg md:leading-[1.75]">
                {t("body")}
              </p>
            </Reveal>
          </div>
        </div>

      </div>
    </section>
  );
}
