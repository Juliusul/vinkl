import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * Future — the closing beat.
 *
 * Extremely minimal. Vast whitespace.
 * One sentence heading, one sentence body.
 * Centred. The emptiness around it is the message:
 * there is space for more.
 */
export function FutureSection() {
  const t = useTranslations("home.future");

  return (
    <section className="px-5 py-24 md:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-[640px] text-center">
        <Reveal stagger>
          <h2 className="reveal-child font-serif text-[clamp(1.5rem,3vw,2.5rem)] font-light leading-snug tracking-tight text-ink-primary">
            {t("heading")}
          </h2>
          <p className="reveal-child mt-4 text-sm text-ink-tertiary">
            {t("body")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
