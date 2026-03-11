import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * Journal Closing — the anti-content-calendar statement.
 *
 * Single line. Vast whitespace.
 * Undercuts the expectation of a publishing schedule.
 */
export function JournalClosing() {
  const t = useTranslations("journal");

  return (
    <section className="px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="font-serif text-lg font-light italic text-ink-tertiary md:text-xl">
            {t("closing")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
