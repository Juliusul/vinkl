import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";

/**
 * Featured Object — the teak shelf presentation.
 *
 * Full-bleed image area followed by minimal product info.
 * Presented like a gallery object, not a product card.
 */
export function FeaturedObjectSection() {
  const t = useTranslations("home.featured");
  const tImg = useTranslations("images");

  return (
    <section className="py-16 md:py-20 lg:py-24">
      {/* Full-bleed image area */}
      <Reveal>
        <div className="relative mx-5 aspect-[4/3] overflow-hidden md:mx-10 md:aspect-[16/9] lg:mx-0 lg:aspect-[2/1]">
          <Image
            src="/images/vinkl-regal-3.webp"
            alt={tImg("featured")}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </Reveal>

      {/* Product info — contained */}
      <div className="mx-auto mt-10 w-full max-w-[1200px] px-5 md:mt-14 md:px-10 lg:px-16">
        <Reveal stagger>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end md:gap-8">
            <div className="md:col-span-7">
              <p className="reveal-child section-label text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
                {t("label")}
              </p>
              <h2 className="reveal-child mt-3 font-serif text-3xl font-light tracking-tight md:text-4xl">
                {t("name")}
              </h2>
              <p className="reveal-child mt-4 max-w-md text-base leading-relaxed text-ink-secondary">
                {t("description")}
              </p>
            </div>

            <div className="md:col-span-5 md:text-right">
              <Link
                href="/objects/vinkl"
                className="reveal-child inline-block border border-ink-primary px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-ink-primary transition-colors duration-[--duration-fast] ease-[--ease-out] hover:border-terracotta hover:bg-terracotta hover:text-ink-inverse"
              >
                {t("cta")}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
