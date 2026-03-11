import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * Product Story — the emotional argument.
 *
 * Why this shelf exists. Asymmetric layout: text left,
 * lifestyle image right. Pull quote breaks the rhythm.
 */
export function ProductStory() {
  const t = useTranslations("vinkl.story");
  const tImg = useTranslations("images");

  return (
    <section className="border-t border-border-default px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Text — 5 columns */}
          <div className="lg:col-span-5">
            <Reveal stagger>
              <p className="reveal-child text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
                {t("label")}
              </p>
              <h2 className="reveal-child mt-4 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-light leading-[1.15] tracking-tight">
                {t("heading")}
              </h2>
              <p className="reveal-child mt-6 text-base leading-[1.75] text-ink-secondary">
                {t("body")}
              </p>
            </Reveal>

            {/* Pull quote */}
            <Reveal>
              <blockquote className="mt-10 border-l-2 border-terracotta pl-6">
                <p className="font-serif text-lg font-light leading-snug tracking-tight text-ink-primary md:text-xl">
                  {t("quote")}
                </p>
              </blockquote>
            </Reveal>
          </div>

          {/* Image — 7 columns */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/vinkl-regal-2.webp"
                  alt={tImg("productAngle")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
