import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * Product Specs — the precision grid.
 *
 * Clean, architectural data display. Two columns of
 * label/value pairs separated by hairline borders.
 * No icons, no visual noise — just the numbers.
 *
 * This section converts detail-oriented buyers.
 */
export function ProductSpecs() {
  const t = useTranslations("vinkl.specs");

  const specs = [
    { label: t("dimensionsLabel"), value: t("dimensionsValue") },
    { label: t("weightLabel"), value: t("weightValue") },
    { label: t("materialLabel"), value: t("materialValue") },
    { label: t("rangeLabel"), value: t("rangeValue") },
    { label: t("mountingLabel"), value: t("mountingValue") },
    { label: t("loadLabel"), value: t("loadValue") },
  ];

  return (
    <section className="bg-bg-warm px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
            {t("label")}
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 md:mt-10">
            {specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex items-baseline justify-between gap-4 border-t border-border-default py-4 md:py-5 ${
                  i % 2 === 0 ? "md:pr-8 lg:pr-12" : "md:pl-8 lg:pl-12 md:border-l"
                }`}
              >
                <span className="text-xs font-medium uppercase tracking-widest text-ink-tertiary">
                  {spec.label}
                </span>
                <span className="text-right text-sm text-ink-primary">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
