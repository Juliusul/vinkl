import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * About Architecture — the material statement.
 *
 * Full-width image band breaks the rhythm and adds weight.
 */
export function AboutArchitecture() {
  const t = useTranslations("about.architecture");
  const tImg = useTranslations("images");

  return (
    <section className="py-16 md:py-20 lg:py-24">
      {/* Image band — full bleed, cinematic ratio */}
      <Reveal>
        <div className="relative mx-5 aspect-[21/9] overflow-hidden md:mx-10 lg:mx-0">
          <Image
            src="/images/vinkl-regal-1.webp"
            alt={tImg("architecture")}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </Reveal>

      {/* Text content */}
      <div className="mx-auto mt-12 w-full max-w-[1200px] px-5 md:mt-16 md:px-10 lg:px-16">
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
