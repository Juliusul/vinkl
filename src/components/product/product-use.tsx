import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * Product Use — the architectural application.
 *
 * Three scenario cards (Altbau, Neubau, Dachschräge)
 * with angle numbers in terracotta and product images.
 */

const SCENARIO_IMAGES = [
  "/images/vinkl-regal-4.webp",
  "/images/vinkl-regal-3.webp",
  "/images/vinkl-regal-5.webp",
] as const;

export function ProductUse() {
  const t = useTranslations("vinkl.use");

  const scenarios = [
    {
      label: t("altbauLabel"),
      angle: t("altbauAngle"),
      desc: t("altbauDesc"),
      image: SCENARIO_IMAGES[0],
    },
    {
      label: t("neubauLabel"),
      angle: t("neubauAngle"),
      desc: t("neubauDesc"),
      image: SCENARIO_IMAGES[1],
    },
    {
      label: t("dachLabel"),
      angle: t("dachAngle"),
      desc: t("dachDesc"),
      image: SCENARIO_IMAGES[2],
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
          <h2 className="reveal-child mt-4 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-light leading-[1.15] tracking-tight">
            {t("heading")}
          </h2>
          <p className="reveal-child mt-4 max-w-xl text-base leading-[1.75] text-ink-secondary">
            {t("body")}
          </p>
        </Reveal>

        {/* Scenario cards */}
        <div className="mt-12 grid grid-cols-1 gap-px bg-border-default md:mt-14 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <Reveal key={scenario.label}>
              <div className="flex flex-col bg-bg-cream px-6 py-8 md:px-8 md:py-10">
                <p className="font-serif text-[clamp(2.5rem,5vw,3.5rem)] font-light leading-none tracking-tight text-terracotta">
                  {scenario.angle}
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-widest text-ink-primary">
                  {scenario.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
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
