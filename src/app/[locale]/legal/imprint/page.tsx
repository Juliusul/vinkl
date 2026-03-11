import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Impressum — VINKL",
};

export default async function ImprintPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (locale === "en") return <ImprintEN />;
  return <ImprintDE />;
}

/* ── German ── */
function ImprintDE() {
  return (
    <article className="mx-auto w-full max-w-[760px] px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <h1 className="font-serif text-3xl font-light tracking-tight md:text-4xl">
        Impressum
      </h1>

      <div className="mt-10 space-y-8 text-sm leading-[1.8] text-ink-secondary">
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Angaben gemäß § 5 TMG
          </h2>
          <div className="mt-4">
            <p>Larissa Wagner</p>
            <p>Haidberg 8</p>
            <p>93491 Stamsried</p>
            <p>Deutschland</p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Kontakt
          </h2>
          <div className="mt-4">
            <p>E-Mail: hello@vinkl.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Umsatzsteuer-ID
          </h2>
          <div className="mt-4">
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a
              Umsatzsteuergesetz: wird nachgetragen.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <div className="mt-4">
            <p>Larissa Wagner</p>
            <p>Haidberg 8</p>
            <p>93491 Stamsried</p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            EU-Streitschlichtung
          </h2>
          <div className="mt-4">
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="mt-2">
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Haftung für Inhalte
          </h2>
          <div className="mt-4">
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
              gespeicherte fremde Informationen zu überwachen oder nach
              Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
              hinweisen.
            </p>
            <p className="mt-2">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon
              unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
              Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
              möglich. Bei Bekanntwerden von entsprechenden
              Rechtsverletzungen werden wir diese Inhalte umgehend
              entfernen.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Haftung für Links
          </h2>
          <div className="mt-4">
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir
              für diese fremden Inhalte auch keine Gewähr übernehmen. Für
              die Inhalte der verlinkten Seiten ist stets der jeweilige
              Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Urheberrecht
          </h2>
          <div className="mt-4">
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke
              auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen
              der schriftlichen Zustimmung des jeweiligen Autors bzw.
              Erstellers.
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}

/* ── English ── */
function ImprintEN() {
  return (
    <article className="mx-auto w-full max-w-[760px] px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <h1 className="font-serif text-3xl font-light tracking-tight md:text-4xl">
        Legal Notice
      </h1>

      <div className="mt-10 space-y-8 text-sm leading-[1.8] text-ink-secondary">
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Information pursuant to § 5 TMG
          </h2>
          <div className="mt-4">
            <p>Larissa Wagner</p>
            <p>Haidberg 8</p>
            <p>93491 Stamsried</p>
            <p>Germany</p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Contact
          </h2>
          <div className="mt-4">
            <p>Email: hello@vinkl.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            VAT ID
          </h2>
          <div className="mt-4">
            <p>
              VAT identification number pursuant to § 27a of the German VAT
              Act: to be added.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Responsible for content pursuant to § 55 (2) RStV
          </h2>
          <div className="mt-4">
            <p>Larissa Wagner</p>
            <p>Haidberg 8</p>
            <p>93491 Stamsried</p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            EU Dispute Resolution
          </h2>
          <div className="mt-4">
            <p>
              The European Commission provides a platform for online dispute
              resolution (ODR):{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="mt-2">
              We are neither willing nor obligated to participate in dispute
              resolution proceedings before a consumer arbitration board.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Liability for Content
          </h2>
          <div className="mt-4">
            <p>
              As a service provider, we are responsible for our own content
              on these pages in accordance with § 7 (1) TMG under general
              law. According to §§ 8 to 10 TMG, however, we are not
              obligated to monitor transmitted or stored third-party
              information or to investigate circumstances that indicate
              illegal activity.
            </p>
            <p className="mt-2">
              Obligations to remove or block the use of information under
              general law remain unaffected. However, liability in this
              regard is only possible from the point in time at which we
              become aware of a specific legal violation. Upon becoming
              aware of such violations, we will remove the content
              immediately.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Liability for Links
          </h2>
          <div className="mt-4">
            <p>
              Our website contains links to external third-party websites
              over whose content we have no influence. Therefore, we cannot
              accept any liability for this third-party content. The
              respective provider or operator of the linked pages is always
              responsible for the content of those pages.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            Copyright
          </h2>
          <div className="mt-4">
            <p>
              The content and works created by the site operators on these
              pages are subject to German copyright law. Duplication,
              processing, distribution, and any kind of exploitation beyond
              the limits of copyright law require the written consent of the
              respective author or creator.
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}
