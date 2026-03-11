import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

/**
 * Journal Entries — article teasers.
 *
 * Numbered entries with tag, title, abstract.
 * Each entry separated by a fine border.
 * Laid out like an editorial index, not a card grid.
 */

const ENTRY_KEYS = ["entry1", "entry2", "entry3", "entry4", "entry5"] as const;

export function JournalEntries() {
  const t = useTranslations("journal.entries");

  return (
    <section className="px-5 pb-16 md:px-10 md:pb-20 lg:px-16 lg:pb-24">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Divider above first entry */}
        <div className="border-t border-border-default" />

        {ENTRY_KEYS.map((key, index) => (
          <Reveal key={key}>
            <article className="border-b border-border-default py-10 md:py-14">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
                {/* Left column: number + tag */}
                <div className="md:col-span-3 lg:col-span-2">
                  <span className="font-serif text-sm text-ink-tertiary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="ml-4 text-xs font-medium uppercase tracking-[0.12em] text-ink-tertiary">
                    {t(`${key}.tag`)}
                  </span>
                </div>

                {/* Right column: title + abstract */}
                <div className="md:col-span-9 lg:col-span-10">
                  <h2 className="font-serif text-xl font-light tracking-tight text-ink-primary md:text-2xl lg:text-[1.75rem]">
                    {t(`${key}.title`)}
                  </h2>
                  <p className="mt-4 max-w-[640px] text-base leading-[1.7] text-ink-secondary">
                    {t(`${key}.abstract`)}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
