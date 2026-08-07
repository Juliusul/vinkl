import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * Product Use — the versatility story.
 *
 * Three mounting scenarios (Innenecke 90°, Gerade Wand 180°,
 * Außenecke 270°) with angle numbers in terracotta and the matching
 * render for each configuration — the pivot bearing is the USP.
 */

const SCENARIO_IMAGES = {
  innen: "/images/vinkl-regal-4.webp", // inside corner
  wand: "/images/vinkl-regal-5.webp", // flat wall, fully open
  aussen: "/images/vinkl-regal-3.webp", // wrapped around an outside corner
} as const;

export function ProductUse() {
  const t = useTranslations("vinkl.use");

  const scenarios = [
    {
      label: t("innenLabel"),
      angle: t("innenAngle"),
      desc: t("innenDesc"),
      image: SCENARIO_IMAGES.innen,
    },
    {
      label: t("wandLabel"),
      angle: t("wandAngle"),
      desc: t("wandDesc"),
      image: SCENARIO_IMAGES.wand,
    },
    {
      label: t("aussenLabel"),
      angle: t("aussenAngle"),
      desc: t("aussenDesc"),
      image: SCENARIO_IMAGES.aussen,
    },
  ];

  return (
    <section className="px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <Reveal stagger>
          <p className="reveal-child text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
            {t("label")}
          </p>
          <h2 className="reveal-child mt-4 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.15] tracking-tight">
            {t("heading")}
          </h2>
          <p className="reveal-child mt-4 max-w-xl text-base leading-[1.75] text-ink-secondary">
            {t("body")}
          </p>
        </Reveal>

        {/* Scenario cards — hairlines as real borders, NOT a gray container
            bg behind gap-px: the reveal animation fades the cards in, and a
            gray backdrop shines through every half-faded or untriggered card
            (the tablet "gray bar" bug). Borders live on the cells instead. */}
        <div className="mt-12 grid grid-cols-1 divide-y divide-border-default md:mt-14 md:grid-cols-3 md:divide-x md:divide-y-0">
          {scenarios.map((scenario) => (
            <Reveal key={scenario.label} className="h-full">
              <div className="flex h-full flex-col bg-bg-cream px-6 py-8 md:px-8 md:py-10">
                <p className="font-heading text-[clamp(2.5rem,5vw,3.5rem)] font-normal leading-none tracking-tight text-terracotta">
                  {scenario.angle}
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-widest text-ink-primary">
                  {scenario.label}
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-secondary">
                  {scenario.desc}
                </p>
                <div className="relative mt-6 aspect-[3/2] overflow-hidden">
                  <Image
                    src={scenario.image}
                    alt={`VINKL — ${scenario.label}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
