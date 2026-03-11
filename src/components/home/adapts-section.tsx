import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * Adapts — the core concept.
 *
 * 2-column layout: dominant vertical image left, text right.
 * Uses the vertical composition of vinkl-regal-2 (1400x1600).
 */
export function AdaptsSection() {
  const t = useTranslations("home.adapts");
  const tImg = useTranslations("images");

  return (
    <section className="px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Image — 7 columns, vertical composition */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            <Reveal>
              <div className="relative aspect-[7/8] overflow-hidden">
                <Image
                  src="/images/vinkl-regal-2.webp"
                  alt={tImg("adapts")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center"
                />
              </div>
            </Reveal>
          </div>

          {/* Text — 5 columns */}
          <div className="order-1 flex flex-col justify-center lg:order-2 lg:col-span-5">
            <Reveal stagger>
              <p className="reveal-child section-label text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
                {t("label")}
              </p>
              <h2 className="reveal-child mt-4 font-serif text-[clamp(1.75rem,3.5vw,3rem)] font-light leading-[1.1] tracking-tight">
                {t("heading")}
                <br />
                {t("headingLine2")}
              </h2>
              <p className="reveal-child mt-6 text-base leading-[1.7] text-ink-secondary md:text-lg md:leading-[1.75]">
                {t("body")}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
