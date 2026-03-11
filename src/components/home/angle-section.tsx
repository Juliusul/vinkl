import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * Angle — the precision moment.
 *
 * Centred, typographic impact. The numbers 85°–95° are
 * the visual anchor — displayed at display scale,
 * serif, terracotta accent. This section breathes.
 * No image. Pure confidence in the number.
 */
export function AngleSection() {
  const t = useTranslations("home.angle");

  return (
    <section className="px-5 py-20 md:py-28 lg:py-36">
      <div className="mx-auto w-full max-w-[960px] text-center">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
            {t("label")}
          </p>
        </Reveal>

        <Reveal>
          <p className="mt-6 font-serif text-[clamp(3.5rem,10vw,9rem)] font-light leading-none tracking-tight text-terracotta md:mt-8">
            {t("range")}
          </p>
        </Reveal>

        <Reveal>
          <p className="mx-auto mt-6 max-w-md text-base leading-[1.7] text-ink-secondary md:mt-8 md:text-lg md:leading-[1.75]">
            {t("body")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
