import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

/**
 * Waitlist — the pre-launch conversion section.
 *
 * Until the first edition ships (early August), capturing the email
 * IS the sale. Asymmetric 5/7 split like the philosophy section.
 */
export function WaitlistSection() {
  const t = useTranslations("waitlist");

  return (
    <section className="border-t border-border-default bg-bg-warm px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="section-label text-xs font-medium uppercase tracking-[0.15em] text-ink-tertiary">
                {t("label")}
              </p>
              <h2 className="mt-4 font-heading text-[clamp(1.75rem,3vw,2.75rem)] font-normal leading-[1.15] tracking-tight">
                {t("heading")}
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="text-base leading-[1.7] text-ink-secondary">
                {t("body")}
              </p>
              <div className="mt-6">
                <WaitlistForm />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
