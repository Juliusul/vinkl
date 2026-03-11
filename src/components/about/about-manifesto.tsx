import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * About Manifesto — the closing punch.
 *
 * Two lines. Vast whitespace.
 * The architectural equivalent of dropping the mic.
 */
export function AboutManifesto() {
  const t = useTranslations("about.manifesto");

  return (
    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="font-serif text-[clamp(1.5rem,3.5vw,3rem)] font-light leading-[1.2] tracking-tight text-ink-primary">
            {t("line1")}
            <br />
            <span className="text-terracotta">{t("line2")}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
