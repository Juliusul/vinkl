import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Hero — the opening statement.
 *
 * Text occupies the left 55%. The product image is
 * absolutely positioned on the right — flush to all edges,
 * full section height.
 *
 * Desktop: right-side image panel, edge-to-edge, full height.
 * Mobile:  full-section background at reduced opacity.
 */
export function HeroSection() {
  const t = useTranslations("home.hero");
  const tImg = useTranslations("images");

  return (
    <section className="relative flex min-h-[92vh] flex-col justify-between overflow-hidden px-5 pb-12 pt-24 md:px-10 md:pt-32 lg:px-16 lg:pt-40">

      {/* Desktop right panel — hero image */}
      <div className="hero-animate hero-animate-delay-3 absolute inset-y-0 right-0 hidden w-[42%] lg:block">
        <Image
          src="/images/vinkl-regal-3.webp"
          alt={tImg("hero")}
          fill
          priority
          sizes="42vw"
          className="object-cover object-center"
        />
      </div>

      {/* Mobile atmospheric background */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          src="/images/vinkl-regal-3.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.25]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <div className="max-w-[900px] lg:max-w-[55%]">
          <h1 className="font-serif font-light tracking-tight text-ink-primary">
            <span className="hero-animate block text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.08]">
              {t("line1")}
            </span>
            <span className="hero-animate hero-animate-delay-1 block text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.08]">
              {t("line2")}
            </span>
          </h1>
          <p className="hero-animate hero-animate-delay-2 mt-6 font-serif text-[clamp(1.25rem,2.5vw,2rem)] font-light leading-snug text-ink-secondary md:mt-8">
            {t("line3")}
          </p>
          <Link
            href="/objects/vinkl"
            className="hero-animate hero-animate-delay-3 mt-8 inline-block bg-ink-primary px-8 py-4 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-colors duration-[--duration-fast] ease-[--ease-out] hover:bg-terracotta md:mt-10"
          >
            {t("cta")}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator relative z-10 mx-auto flex flex-col items-center gap-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-ink-tertiary">
          {t("scroll")}
        </span>
        <div className="h-8 w-px bg-ink-tertiary" />
      </div>

    </section>
  );
}
