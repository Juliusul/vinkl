import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Datenschutz — VINKL",
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (locale === "en") return <PrivacyEN />;
  return <PrivacyDE />;
}

/* ── German ── */
function PrivacyDE() {
  return (
    <article className="mx-auto w-full max-w-[760px] px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <h1 className="font-serif text-3xl font-light tracking-tight md:text-4xl">
        Datenschutzerklärung
      </h1>

      <div className="mt-10 space-y-8 text-sm leading-[1.8] text-ink-secondary">
        {/* ── 1. Verantwortlicher ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            1. Verantwortlicher
          </h2>
          <div className="mt-4">
            <p>
              Verantwortliche im Sinne der Datenschutz-Grundverordnung (DSGVO)
              und anderer nationaler Datenschutzgesetze sowie sonstiger
              datenschutzrechtlicher Bestimmungen ist:
            </p>
            <p className="mt-2">Larissa Wagner</p>
            <p>Haidberg 8</p>
            <p>93491 Stamsried</p>
            <p>Deutschland</p>
            <p className="mt-2">
              E-Mail:{" "}
              <a
                href="mailto:hello@vinkl.com"
                className="text-ink-primary underline underline-offset-2"
              >
                hello@vinkl.com
              </a>
            </p>
            <p>
              Website:{" "}
              <a
                href="https://vinkl.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                vinkl.com
              </a>
            </p>
          </div>
        </section>

        {/* ── 2. Allgemeines zur Datenverarbeitung ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            2. Allgemeines zur Datenverarbeitung
          </h2>
          <div className="mt-4">
            <p>
              Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich
              nur, soweit dies zur Bereitstellung einer funktionsfähigen Website
              sowie unserer Inhalte und Leistungen erforderlich ist. Die
              Verarbeitung personenbezogener Daten erfolgt auf Grundlage
              folgender Rechtsgrundlagen:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong className="text-ink-primary">
                  Art. 6 Abs. 1 lit. a DSGVO
                </strong>{" "}
                — Einwilligung der betroffenen Person
              </li>
              <li>
                <strong className="text-ink-primary">
                  Art. 6 Abs. 1 lit. b DSGVO
                </strong>{" "}
                — Verarbeitung zur Erfüllung eines Vertrags oder
                vorvertraglicher Maßnahmen
              </li>
              <li>
                <strong className="text-ink-primary">
                  Art. 6 Abs. 1 lit. c DSGVO
                </strong>{" "}
                — Verarbeitung zur Erfüllung einer rechtlichen Verpflichtung
              </li>
              <li>
                <strong className="text-ink-primary">
                  Art. 6 Abs. 1 lit. f DSGVO
                </strong>{" "}
                — Verarbeitung zur Wahrung berechtigter Interessen
              </li>
            </ul>
            <p className="mt-2">
              Soweit wir für Verarbeitungsvorgänge personenbezogener Daten eine
              Einwilligung einholen, dient Art. 6 Abs. 1 lit. a DSGVO als
              Rechtsgrundlage. Die Einwilligung kann jederzeit widerrufen werden.
            </p>
          </div>
        </section>

        {/* ── 3. Hosting ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            3. Hosting
          </h2>
          <div className="mt-4">
            <p>
              Unsere Website wird bei Vercel Inc., 440 N Barranca Ave #4133,
              Covina, CA 91723, USA (&bdquo;Vercel&ldquo;) gehostet. Beim Besuch
              unserer Website erfasst Vercel automatisch Informationen in
              sogenannten Server-Log-Dateien, die Ihr Browser automatisch
              übermittelt. Dazu gehören:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>IP-Adresse des anfragenden Rechners</li>
              <li>Datum und Uhrzeit der Anfrage</li>
              <li>Zeitzonendifferenz zur Greenwich Mean Time (GMT)</li>
              <li>Inhalt der Anforderung (besuchte Seite)</li>
              <li>Zugriffsstatus / HTTP-Statuscode</li>
              <li>Übertragene Datenmenge</li>
              <li>Website, von der die Anforderung kommt (Referrer)</li>
              <li>Browser, Betriebssystem und dessen Oberfläche</li>
            </ul>
            <p className="mt-2">
              <strong className="text-ink-primary">Rechtsgrundlage:</strong>{" "}
              Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
              sicheren und effizienten Bereitstellung unserer Website).
            </p>
            <p className="mt-2">
              Vercel ist unter dem EU-US Data Privacy Framework zertifiziert, was
              ein angemessenes Datenschutzniveau für die Übermittlung
              personenbezogener Daten in die USA gewährleistet.
            </p>
            <p className="mt-2">
              Weitere Informationen finden Sie in der Datenschutzerklärung von
              Vercel:{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://vercel.com/legal/privacy-policy
              </a>
            </p>
          </div>
        </section>

        {/* ── 4. SSL-Verschlüsselung ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            4. SSL-/TLS-Verschlüsselung
          </h2>
          <div className="mt-4">
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
              Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen
              oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine
              SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung
              erkennen Sie daran, dass die Adresszeile des Browsers von
              &bdquo;http://&ldquo; auf &bdquo;https://&ldquo; wechselt und an
              dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
            <p className="mt-2">
              Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die
              Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen
              werden.
            </p>
          </div>
        </section>

        {/* ── 5. Cookies ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            5. Cookies
          </h2>
          <div className="mt-4">
            <p>
              Unsere Website verwendet Cookies. Cookies sind kleine Textdateien,
              die auf Ihrem Endgerät gespeichert werden und die Ihr Browser
              speichert. Wir setzen folgende Kategorien von Cookies ein:
            </p>
            <p className="mt-4">
              <strong className="text-ink-primary">
                Essenzielle Cookies (technisch notwendig)
              </strong>
            </p>
            <p className="mt-1">
              Diese Cookies sind für den Betrieb der Website zwingend
              erforderlich. Sie ermöglichen grundlegende Funktionen wie die
              Seitennavigation, den Zugriff auf geschützte Bereiche der Website
              und die Speicherung Ihrer Cookie-Einstellungen. Die Website kann
              ohne diese Cookies nicht ordnungsgemäß funktionieren.
            </p>
            <p className="mt-1">
              <strong className="text-ink-primary">Rechtsgrundlage:</strong>{" "}
              Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">Analyse-Cookies</strong>
            </p>
            <p className="mt-1">
              Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer
              Website interagieren, indem sie Informationen sammeln und melden.
              Alle Informationen, die diese Cookies sammeln, werden aggregiert
              und sind daher anonym.
            </p>
            <p className="mt-1">
              <strong className="text-ink-primary">Rechtsgrundlage:</strong>{" "}
              Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über Cookie-Consent).
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">Marketing-Cookies</strong>
            </p>
            <p className="mt-1">
              Diese Cookies werden verwendet, um Werbung relevanter für Sie und
              Ihre Interessen zu gestalten. Sie werden auch dazu verwendet, die
              Anzahl der Anzeigen einer Werbung zu begrenzen und die Effektivität
              von Werbekampagnen zu messen.
            </p>
            <p className="mt-1">
              <strong className="text-ink-primary">Rechtsgrundlage:</strong>{" "}
              Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über Cookie-Consent).
            </p>

            <p className="mt-4">
              Sie können Ihre Cookie-Einstellungen jederzeit über unseren
              Cookie-Consent-Banner anpassen oder Ihre Einwilligung widerrufen.
              Darüber hinaus können Sie Ihren Browser so einstellen, dass Sie
              über das Setzen von Cookies informiert werden, und Cookies nur im
              Einzelfall erlauben.
            </p>
          </div>
        </section>

        {/* ── 6. Vercel Analytics ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            6. Vercel Analytics
          </h2>
          <div className="mt-4">
            <p>
              Wir nutzen Vercel Analytics, einen Webanalysedienst der Vercel
              Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Vercel
              Analytics erfasst anonymisierte Nutzungsdaten, um die Leistung und
              Nutzung unserer Website zu analysieren. Dabei werden folgende Daten
              erhoben:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Seitenaufrufe und Navigationsverhalten</li>
              <li>Web Vitals (Ladezeiten, Interaktivität, visuelle Stabilität)</li>
              <li>Gerätetyp und Browserinformationen (anonymisiert)</li>
              <li>Geografischer Standort (auf Länderebene)</li>
              <li>Referrer-Informationen</li>
            </ul>
            <p className="mt-2">
              Vercel Analytics erhebt <strong className="text-ink-primary">
              keine personenbezogenen Daten</strong> und verwendet keine Cookies.
              Es werden keine IP-Adressen gespeichert oder Nutzerprofile
              erstellt.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Zweck:</strong>{" "}
              Analyse und Optimierung unserer Website-Performance.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Rechtsgrundlage:</strong>{" "}
              Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
              Optimierung unseres Webangebots).
            </p>
            <p className="mt-2">
              Weitere Informationen:{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://vercel.com/legal/privacy-policy
              </a>
            </p>
          </div>
        </section>

        {/* ── 7. Google Analytics ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            7. Google Analytics
          </h2>
          <div className="mt-4">
            <p>
              Wir nutzen auf unserer Website Google Analytics, einen
              Webanalysedienst der Google LLC, 1600 Amphitheatre Parkway,
              Mountain View, CA 94043, USA (&bdquo;Google&ldquo;). Google
              Analytics verwendet Cookies, die eine Analyse der Benutzung unserer
              Website ermöglichen. Die durch das Cookie erzeugten Informationen
              über Ihre Benutzung dieser Website werden in der Regel an einen
              Server von Google in den USA übertragen und dort gespeichert.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">IP-Anonymisierung:</strong>{" "}
              Wir haben auf dieser Website die Funktion IP-Anonymisierung
              aktiviert. Dadurch wird Ihre IP-Adresse von Google innerhalb von
              Mitgliedstaaten der Europäischen Union oder in anderen
              Vertragsstaaten des Abkommens über den Europäischen
              Wirtschaftsraum vor der Übermittlung in die USA gekürzt.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Erhobene Daten:</strong>
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Anonymisierte IP-Adresse</li>
              <li>Besuchte Seiten und Verweildauer</li>
              <li>Verwendetes Betriebssystem und Browser</li>
              <li>Herkunft des Besuchers (Referrer)</li>
              <li>Bildschirmauflösung und Gerätetyp</li>
              <li>Zeitpunkt des Zugriffs</li>
            </ul>
            <p className="mt-2">
              <strong className="text-ink-primary">Zweck:</strong>{" "}
              Analyse des Nutzerverhaltens zur Verbesserung und Optimierung
              unseres Webangebots.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Rechtsgrundlage:</strong>{" "}
              Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über Cookie-Consent).
              Google Analytics wird erst nach Ihrer ausdrücklichen Einwilligung
              über unseren Cookie-Consent-Banner aktiviert.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">
                Datenübermittlung in die USA:
              </strong>{" "}
              Google LLC ist unter dem EU-US Data Privacy Framework zertifiziert,
              was ein angemessenes Datenschutzniveau gewährleistet.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Opt-Out:</strong> Sie können
              die Erfassung durch Google Analytics verhindern, indem Sie Ihre
              Einwilligung über unseren Cookie-Consent-Banner widerrufen. Zudem
              können Sie das Browser-Add-on zur Deaktivierung von Google
              Analytics herunterladen und installieren:{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://tools.google.com/dlpage/gaoptout
              </a>
            </p>
            <p className="mt-2">
              Weitere Informationen:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://policies.google.com/privacy
              </a>
            </p>
          </div>
        </section>

        {/* ── 8. Google Tag Manager ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            8. Google Tag Manager
          </h2>
          <div className="mt-4">
            <p>
              Wir verwenden den Google Tag Manager der Google LLC, 1600
              Amphitheatre Parkway, Mountain View, CA 94043, USA. Der Google
              Tag Manager ist ein Tag-Management-System, mit dem wir
              Tracking-Codes und zugehörige Code-Fragmente (sogenannte
              &bdquo;Tags&ldquo;) auf unserer Website verwalten können.
            </p>
            <p className="mt-2">
              Der Google Tag Manager selbst erstellt keine Nutzerprofile,
              speichert keine Cookies und nimmt keine eigenständige
              Datenerhebung vor. Er dient lediglich als Container-System zur
              Verwaltung und Ausspielung anderer Tags, die ihrerseits unter
              Umständen Daten erfassen können. Für diese eingebundenen Tools
              gelten die jeweiligen Datenschutzbestimmungen (siehe entsprechende
              Abschnitte dieser Datenschutzerklärung).
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Rechtsgrundlage:</strong>{" "}
              Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
              effizienten Verwaltung von Website-Tags).
            </p>
            <p className="mt-2">
              Weitere Informationen:{" "}
              <a
                href="https://marketingplatform.google.com/about/analytics/tag-manager/use-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                Google Tag Manager Nutzungsrichtlinien
              </a>
            </p>
          </div>
        </section>

        {/* ── 9. Meta Pixel (Facebook) ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            9. Meta Pixel (Facebook Pixel)
          </h2>
          <div className="mt-4">
            <p>
              Wir verwenden auf unserer Website das Meta Pixel (ehemals Facebook
              Pixel) der Meta Platforms Ireland Limited, 4 Grand Canal Square,
              Grand Canal Harbour, Dublin 2, Irland (&bdquo;Meta&ldquo;). Das
              Meta Pixel ist ein JavaScript-Code, der auf unserer Website
              eingebunden ist und es uns ermöglicht, die Wirksamkeit unserer
              Werbeanzeigen auf Facebook und Instagram zu messen sowie
              zielgerichtete Werbung auszuspielen.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Erhobene Daten:</strong>
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>HTTP-Header-Informationen (IP-Adresse, Browser, Standort)</li>
              <li>Pixel-spezifische Daten (Pixel-ID, Facebook-Cookie)</li>
              <li>Button-Klick-Daten (angeklickte Buttons, Seitennamen)</li>
              <li>
                Optionale Werte (z.&nbsp;B. Conversion-Wert, Seitentyp)
              </li>
              <li>
                Formularfeldnamen (z.&nbsp;B. E-Mail, Name bei
                Kaufabschluss)
              </li>
            </ul>
            <p className="mt-2">
              <strong className="text-ink-primary">Zweck:</strong>{" "}
              Conversion-Tracking, Erstellung von Custom Audiences für
              zielgerichtete Werbung auf Facebook und Instagram, Remarketing
              und Analyse der Werbewirksamkeit.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Rechtsgrundlage:</strong>{" "}
              Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über Cookie-Consent).
              Das Meta Pixel wird erst nach Ihrer ausdrücklichen Einwilligung
              aktiviert.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">
                Datenübermittlung in die USA:
              </strong>{" "}
              Meta Platforms Inc. ist unter dem EU-US Data Privacy Framework
              zertifiziert, was ein angemessenes Datenschutzniveau für die
              Übermittlung personenbezogener Daten in die USA gewährleistet.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Opt-Out:</strong> Sie können
              Ihre Einwilligung jederzeit über unseren Cookie-Consent-Banner
              widerrufen. Darüber hinaus können Sie die Einstellungen für
              Werbeanzeigen in Ihrem Facebook-Konto anpassen:{" "}
              <a
                href="https://www.facebook.com/settings/?tab=ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://www.facebook.com/settings/?tab=ads
              </a>
            </p>
            <p className="mt-2">
              Weitere Informationen:{" "}
              <a
                href="https://www.facebook.com/privacy/policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                Meta Datenschutzrichtlinie
              </a>
            </p>
          </div>
        </section>

        {/* ── 10. Hotjar ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            10. Hotjar
          </h2>
          <div className="mt-4">
            <p>
              Wir verwenden auf unserer Website Hotjar, einen Analyse-Dienst der
              Hotjar Ltd., Dragonara Business Centre, 5th Floor, Dragonara Road,
              Paceville St Julian&apos;s STJ 3141, Malta (&bdquo;Hotjar&ldquo;).
              Hotjar ermöglicht es uns, das Nutzerverhalten auf unserer Website
              zu analysieren und besser zu verstehen.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Erhobene Daten:</strong>
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Mausbewegungen, Klicks und Scrollverhalten (Heatmaps)</li>
              <li>
                Sitzungsaufzeichnungen (anonymisierte Wiedergabe von
                Nutzerinteraktionen)
              </li>
              <li>Gerätetyp, Bildschirmgröße und Browsertyp</li>
              <li>Geografischer Standort (auf Länderebene)</li>
              <li>Besuchte Seiten und Verweildauer</li>
            </ul>
            <p className="mt-2">
              Hotjar anonymisiert IP-Adressen und blendet sensible
              Eingabefelder (z.&nbsp;B. Passwortfelder) in
              Sitzungsaufzeichnungen automatisch aus. Es werden keine
              personenbezogenen Daten wie E-Mail-Adressen oder Passwörter
              erfasst.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Zweck:</strong>{" "}
              Analyse des Nutzerverhaltens durch Heatmaps und
              Sitzungsaufzeichnungen zur Verbesserung der Benutzerfreundlichkeit
              und des Designs unserer Website.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Rechtsgrundlage:</strong>{" "}
              Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über Cookie-Consent).
              Hotjar wird erst nach Ihrer ausdrücklichen Einwilligung aktiviert.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Opt-Out:</strong> Sie können
              Ihre Einwilligung jederzeit über unseren Cookie-Consent-Banner
              widerrufen. Zudem können Sie die Erfassung durch Hotjar über
              folgenden Link deaktivieren:{" "}
              <a
                href="https://www.hotjar.com/legal/compliance/opt-out"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://www.hotjar.com/legal/compliance/opt-out
              </a>
            </p>
            <p className="mt-2">
              Weitere Informationen:{" "}
              <a
                href="https://www.hotjar.com/legal/policies/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                Hotjar Datenschutzrichtlinie
              </a>
            </p>
          </div>
        </section>

        {/* ── 11. Shopify ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            11. Shopify
          </h2>
          <div className="mt-4">
            <p>
              Für unseren Onlineshop nutzen wir die E-Commerce-Plattform
              Shopify der Shopify International Limited, Victoria Buildings, 2nd
              Floor, 1-2 Haddington Road, Dublin 4, D04 XN32, Irland
              (&bdquo;Shopify&ldquo;). Shopify stellt uns die technische
              Infrastruktur für den Betrieb unseres Onlineshops zur Verfügung,
              einschließlich der Verarbeitung von Bestellungen und
              Zahlungsabwicklung.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Erhobene Daten:</strong>
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>
                Bestelldaten (Name, Adresse, E-Mail, Telefonnummer,
                bestellte Produkte)
              </li>
              <li>Zahlungsdaten (werden von Shopify Payments verarbeitet)</li>
              <li>Versanddaten</li>
              <li>Kontoinformationen (sofern ein Kundenkonto angelegt wird)</li>
              <li>Kommunikationsdaten (z.&nbsp;B. E-Mails im Rahmen der Bestellabwicklung)</li>
            </ul>
            <p className="mt-2">
              <strong className="text-ink-primary">Zweck:</strong>{" "}
              Abwicklung von Bestellungen, Zahlungsabwicklung,
              Versandabwicklung, Kundenservice und Erfüllung gesetzlicher
              Aufbewahrungspflichten.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Rechtsgrundlage:</strong>{" "}
              Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) für die
              Verarbeitung von Bestell- und Zahlungsdaten sowie Art. 6 Abs. 1
              lit. c DSGVO (rechtliche Verpflichtung) für die Einhaltung
              steuerrechtlicher Aufbewahrungspflichten.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">
                Datenübermittlung:
              </strong>{" "}
              Shopify kann Daten an Server in Kanada und den USA übermitteln.
              Shopify ist unter dem EU-US Data Privacy Framework zertifiziert.
            </p>
            <p className="mt-2">
              Weitere Informationen:{" "}
              <a
                href="https://www.shopify.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                Shopify Datenschutzrichtlinie
              </a>
            </p>
          </div>
        </section>

        {/* ── 12. Rechte der Betroffenen ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            12. Rechte der Betroffenen
          </h2>
          <div className="mt-4">
            <p>
              Als betroffene Person haben Sie gemäß der DSGVO folgende Rechte
              in Bezug auf Ihre personenbezogenen Daten:
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">
                Recht auf Auskunft (Art. 15 DSGVO)
              </strong>
            </p>
            <p className="mt-1">
              Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob
              personenbezogene Daten, die Sie betreffen, verarbeitet werden. Ist
              dies der Fall, haben Sie ein Recht auf Auskunft über diese
              personenbezogenen Daten und auf die in Art. 15 DSGVO genannten
              Informationen.
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">
                Recht auf Berichtigung (Art. 16 DSGVO)
              </strong>
            </p>
            <p className="mt-1">
              Sie haben das Recht, unverzüglich die Berichtigung unrichtiger
              personenbezogener Daten zu verlangen. Unter Berücksichtigung der
              Zwecke der Verarbeitung haben Sie das Recht, die Vervollständigung
              unvollständiger personenbezogener Daten zu verlangen.
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">
                Recht auf Löschung (Art. 17 DSGVO)
              </strong>
            </p>
            <p className="mt-1">
              Sie haben das Recht, die unverzügliche Löschung personenbezogener
              Daten zu verlangen, sofern einer der in Art. 17 DSGVO genannten
              Gründe zutrifft, z.&nbsp;B. wenn die Daten für die verfolgten
              Zwecke nicht mehr notwendig sind.
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">
                Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
              </strong>
            </p>
            <p className="mt-1">
              Sie haben das Recht, die Einschränkung der Verarbeitung zu
              verlangen, wenn eine der in Art. 18 DSGVO genannten
              Voraussetzungen gegeben ist, z.&nbsp;B. wenn Sie die Richtigkeit
              der Daten bestreiten.
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">
                Recht auf Datenübertragbarkeit (Art. 20 DSGVO)
              </strong>
            </p>
            <p className="mt-1">
              Sie haben das Recht, die Sie betreffenden personenbezogenen Daten,
              die Sie uns bereitgestellt haben, in einem strukturierten,
              gängigen und maschinenlesbaren Format zu erhalten. Sie haben
              außerdem das Recht, diese Daten einem anderen Verantwortlichen ohne
              Behinderung zu übermitteln.
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">
                Recht auf Widerspruch (Art. 21 DSGVO)
              </strong>
            </p>
            <p className="mt-1">
              Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen
              Situation ergeben, jederzeit gegen die Verarbeitung Sie
              betreffender personenbezogener Daten, die auf Art. 6 Abs. 1 lit. e
              oder f DSGVO beruht, Widerspruch einzulegen. Werden
              personenbezogene Daten verarbeitet, um Direktwerbung zu betreiben,
              haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung
              einzulegen.
            </p>

            <p className="mt-4">
              Zur Ausübung Ihrer Rechte können Sie sich jederzeit an uns wenden
              unter:{" "}
              <a
                href="mailto:hello@vinkl.com"
                className="text-ink-primary underline underline-offset-2"
              >
                hello@vinkl.com
              </a>
            </p>
          </div>
        </section>

        {/* ── 13. Beschwerderecht bei Aufsichtsbehörde ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            13. Beschwerderecht bei einer Aufsichtsbehörde
          </h2>
          <div className="mt-4">
            <p>
              Unbeschadet eines anderweitigen verwaltungsrechtlichen oder
              gerichtlichen Rechtsbehelfs steht Ihnen das Recht auf Beschwerde
              bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat
              Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des
              mutmaßlichen Verstoßes, zu, wenn Sie der Ansicht sind, dass die
              Verarbeitung der Sie betreffenden personenbezogenen Daten gegen
              die DSGVO verstößt (Art. 77 DSGVO).
            </p>
            <p className="mt-2">
              Die für uns zuständige Aufsichtsbehörde ist:
            </p>
            <p className="mt-2">
              Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
            </p>
            <p>Promenade 18</p>
            <p>91522 Ansbach</p>
            <p>Deutschland</p>
            <p className="mt-2">
              Website:{" "}
              <a
                href="https://www.lda.bayern.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://www.lda.bayern.de
              </a>
            </p>
          </div>
        </section>

        {/* ── 14. Änderungen der Datenschutzerklärung ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            14. Änderungen dieser Datenschutzerklärung
          </h2>
          <div className="mt-4">
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit
              sie stets den aktuellen rechtlichen Anforderungen entspricht oder
              um Änderungen unserer Leistungen in der Datenschutzerklärung
              umzusetzen, z.&nbsp;B. bei der Einführung neuer Services. Für
              Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
            </p>
            <p className="mt-2">
              Stand: März 2026
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}

/* ── English ── */
function PrivacyEN() {
  return (
    <article className="mx-auto w-full max-w-[760px] px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <h1 className="font-serif text-3xl font-light tracking-tight md:text-4xl">
        Privacy Policy
      </h1>

      <div className="mt-10 space-y-8 text-sm leading-[1.8] text-ink-secondary">
        {/* ── 1. Data Controller ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            1. Data Controller
          </h2>
          <div className="mt-4">
            <p>
              The controller within the meaning of the General Data Protection
              Regulation (GDPR) and other national data protection laws as well
              as other data protection provisions is:
            </p>
            <p className="mt-2">Larissa Wagner</p>
            <p>Haidberg 8</p>
            <p>93491 Stamsried</p>
            <p>Germany</p>
            <p className="mt-2">
              Email:{" "}
              <a
                href="mailto:hello@vinkl.com"
                className="text-ink-primary underline underline-offset-2"
              >
                hello@vinkl.com
              </a>
            </p>
            <p>
              Website:{" "}
              <a
                href="https://vinkl.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                vinkl.com
              </a>
            </p>
          </div>
        </section>

        {/* ── 2. General Data Processing ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            2. General Data Processing
          </h2>
          <div className="mt-4">
            <p>
              We only process personal data of our users insofar as this is
              necessary to provide a functional website as well as our content
              and services. The processing of personal data is carried out on the
              basis of the following legal grounds:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong className="text-ink-primary">
                  Art. 6(1)(a) GDPR
                </strong>{" "}
                — Consent of the data subject
              </li>
              <li>
                <strong className="text-ink-primary">
                  Art. 6(1)(b) GDPR
                </strong>{" "}
                — Processing for the performance of a contract or pre-contractual
                measures
              </li>
              <li>
                <strong className="text-ink-primary">
                  Art. 6(1)(c) GDPR
                </strong>{" "}
                — Processing for compliance with a legal obligation
              </li>
              <li>
                <strong className="text-ink-primary">
                  Art. 6(1)(f) GDPR
                </strong>{" "}
                — Processing for the purposes of legitimate interests
              </li>
            </ul>
            <p className="mt-2">
              Where we obtain consent for the processing of personal data,
              Art. 6(1)(a) GDPR serves as the legal basis. Consent may be
              withdrawn at any time.
            </p>
          </div>
        </section>

        {/* ── 3. Hosting ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            3. Hosting
          </h2>
          <div className="mt-4">
            <p>
              Our website is hosted by Vercel Inc., 440 N Barranca Ave #4133,
              Covina, CA 91723, USA (&ldquo;Vercel&rdquo;). When you visit our
              website, Vercel automatically collects information in so-called
              server log files that your browser transmits automatically. This
              includes:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>IP address of the requesting device</li>
              <li>Date and time of the request</li>
              <li>Time zone difference to Greenwich Mean Time (GMT)</li>
              <li>Content of the request (page visited)</li>
              <li>Access status / HTTP status code</li>
              <li>Amount of data transferred</li>
              <li>Referring website (referrer)</li>
              <li>Browser, operating system, and its interface</li>
            </ul>
            <p className="mt-2">
              <strong className="text-ink-primary">Legal basis:</strong>{" "}
              Art. 6(1)(f) GDPR (legitimate interest in the secure and efficient
              provision of our website).
            </p>
            <p className="mt-2">
              Vercel is certified under the EU-US Data Privacy Framework, which
              ensures an adequate level of data protection for the transfer of
              personal data to the USA.
            </p>
            <p className="mt-2">
              For more information, please refer to Vercel&apos;s privacy
              policy:{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://vercel.com/legal/privacy-policy
              </a>
            </p>
          </div>
        </section>

        {/* ── 4. SSL/TLS Encryption ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            4. SSL/TLS Encryption
          </h2>
          <div className="mt-4">
            <p>
              This website uses SSL or TLS encryption for security reasons and to
              protect the transmission of confidential content, such as orders or
              enquiries that you send to us as the site operator. You can
              recognise an encrypted connection by the browser&apos;s address
              line changing from &ldquo;http://&rdquo; to &ldquo;https://&rdquo;
              and by the lock icon in your browser bar.
            </p>
            <p className="mt-2">
              When SSL or TLS encryption is activated, the data you transmit to
              us cannot be read by third parties.
            </p>
          </div>
        </section>

        {/* ── 5. Cookies ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            5. Cookies
          </h2>
          <div className="mt-4">
            <p>
              Our website uses cookies. Cookies are small text files that are
              stored on your device and saved by your browser. We use the
              following categories of cookies:
            </p>
            <p className="mt-4">
              <strong className="text-ink-primary">
                Essential cookies (technically necessary)
              </strong>
            </p>
            <p className="mt-1">
              These cookies are strictly necessary for the operation of the
              website. They enable basic functions such as page navigation,
              access to protected areas of the website, and storing your cookie
              preferences. The website cannot function properly without these
              cookies.
            </p>
            <p className="mt-1">
              <strong className="text-ink-primary">Legal basis:</strong>{" "}
              Art. 6(1)(f) GDPR (legitimate interest).
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">Analytics cookies</strong>
            </p>
            <p className="mt-1">
              These cookies help us understand how visitors interact with our
              website by collecting and reporting information. All information
              collected by these cookies is aggregated and therefore anonymous.
            </p>
            <p className="mt-1">
              <strong className="text-ink-primary">Legal basis:</strong>{" "}
              Art. 6(1)(a) GDPR (consent via cookie consent banner).
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">Marketing cookies</strong>
            </p>
            <p className="mt-1">
              These cookies are used to make advertising more relevant to you and
              your interests. They are also used to limit the number of times you
              see an advertisement and to measure the effectiveness of
              advertising campaigns.
            </p>
            <p className="mt-1">
              <strong className="text-ink-primary">Legal basis:</strong>{" "}
              Art. 6(1)(a) GDPR (consent via cookie consent banner).
            </p>

            <p className="mt-4">
              You can adjust your cookie preferences at any time via our cookie
              consent banner or withdraw your consent. You can also configure
              your browser to notify you when cookies are being set and to allow
              cookies only on a case-by-case basis.
            </p>
          </div>
        </section>

        {/* ── 6. Vercel Analytics ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            6. Vercel Analytics
          </h2>
          <div className="mt-4">
            <p>
              We use Vercel Analytics, a web analytics service provided by Vercel
              Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Vercel
              Analytics collects anonymised usage data to analyse the performance
              and usage of our website. The following data is collected:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Page views and navigation behaviour</li>
              <li>Web Vitals (load times, interactivity, visual stability)</li>
              <li>Device type and browser information (anonymised)</li>
              <li>Geographic location (country level)</li>
              <li>Referrer information</li>
            </ul>
            <p className="mt-2">
              Vercel Analytics does <strong className="text-ink-primary">
              not collect any personal data</strong> and does not use cookies.
              No IP addresses are stored and no user profiles are created.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Purpose:</strong>{" "}
              Analysis and optimisation of our website performance.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Legal basis:</strong>{" "}
              Art. 6(1)(f) GDPR (legitimate interest in the optimisation of our
              website).
            </p>
            <p className="mt-2">
              More information:{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://vercel.com/legal/privacy-policy
              </a>
            </p>
          </div>
        </section>

        {/* ── 7. Google Analytics ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            7. Google Analytics
          </h2>
          <div className="mt-4">
            <p>
              We use Google Analytics on our website, a web analytics service
              provided by Google LLC, 1600 Amphitheatre Parkway, Mountain View,
              CA 94043, USA (&ldquo;Google&rdquo;). Google Analytics uses cookies
              that enable an analysis of your use of our website. The information
              generated by the cookie about your use of this website is usually
              transmitted to and stored on a Google server in the USA.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">IP anonymisation:</strong>{" "}
              We have activated IP anonymisation on this website. This means that
              your IP address is truncated by Google within member states of the
              European Union or in other contracting states of the Agreement on
              the European Economic Area before being transmitted to the USA.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Data collected:</strong>
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Anonymised IP address</li>
              <li>Pages visited and time spent on pages</li>
              <li>Operating system and browser used</li>
              <li>Origin of the visitor (referrer)</li>
              <li>Screen resolution and device type</li>
              <li>Time of access</li>
            </ul>
            <p className="mt-2">
              <strong className="text-ink-primary">Purpose:</strong>{" "}
              Analysis of user behaviour to improve and optimise our website.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Legal basis:</strong>{" "}
              Art. 6(1)(a) GDPR (consent via cookie consent banner). Google
              Analytics is only activated after your explicit consent via our
              cookie consent banner.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">
                Data transfer to the USA:
              </strong>{" "}
              Google LLC is certified under the EU-US Data Privacy Framework,
              which ensures an adequate level of data protection.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Opt-out:</strong> You can
              prevent data collection by Google Analytics by withdrawing your
              consent via our cookie consent banner. You can also download and
              install the browser add-on to disable Google Analytics:{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://tools.google.com/dlpage/gaoptout
              </a>
            </p>
            <p className="mt-2">
              More information:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://policies.google.com/privacy
              </a>
            </p>
          </div>
        </section>

        {/* ── 8. Google Tag Manager ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            8. Google Tag Manager
          </h2>
          <div className="mt-4">
            <p>
              We use Google Tag Manager provided by Google LLC, 1600
              Amphitheatre Parkway, Mountain View, CA 94043, USA. Google Tag
              Manager is a tag management system that allows us to manage
              tracking codes and related code fragments (so-called
              &ldquo;tags&rdquo;) on our website.
            </p>
            <p className="mt-2">
              Google Tag Manager itself does not create user profiles, does not
              store cookies, and does not perform any independent data
              collection. It serves solely as a container system for the
              management and deployment of other tags, which in turn may collect
              data. The respective privacy policies apply to these integrated
              tools (see the corresponding sections of this privacy policy).
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Legal basis:</strong>{" "}
              Art. 6(1)(f) GDPR (legitimate interest in the efficient management
              of website tags).
            </p>
            <p className="mt-2">
              More information:{" "}
              <a
                href="https://marketingplatform.google.com/about/analytics/tag-manager/use-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                Google Tag Manager Terms of Service
              </a>
            </p>
          </div>
        </section>

        {/* ── 9. Meta Pixel (Facebook) ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            9. Meta Pixel (Facebook Pixel)
          </h2>
          <div className="mt-4">
            <p>
              We use the Meta Pixel (formerly Facebook Pixel) on our website,
              provided by Meta Platforms Ireland Limited, 4 Grand Canal Square,
              Grand Canal Harbour, Dublin 2, Ireland (&ldquo;Meta&rdquo;). The
              Meta Pixel is a JavaScript code embedded on our website that
              enables us to measure the effectiveness of our advertisements on
              Facebook and Instagram and to deliver targeted advertising.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Data collected:</strong>
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>HTTP header information (IP address, browser, location)</li>
              <li>Pixel-specific data (pixel ID, Facebook cookie)</li>
              <li>Button click data (buttons clicked, page names)</li>
              <li>
                Optional values (e.g. conversion value, page type)
              </li>
              <li>
                Form field names (e.g. email, name at checkout)
              </li>
            </ul>
            <p className="mt-2">
              <strong className="text-ink-primary">Purpose:</strong>{" "}
              Conversion tracking, creation of custom audiences for targeted
              advertising on Facebook and Instagram, remarketing, and analysis of
              advertising effectiveness.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Legal basis:</strong>{" "}
              Art. 6(1)(a) GDPR (consent via cookie consent banner). The Meta
              Pixel is only activated after your explicit consent.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">
                Data transfer to the USA:
              </strong>{" "}
              Meta Platforms Inc. is certified under the EU-US Data Privacy
              Framework, which ensures an adequate level of data protection for
              the transfer of personal data to the USA.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Opt-out:</strong> You can
              withdraw your consent at any time via our cookie consent banner.
              You can also adjust the advertising settings in your Facebook
              account:{" "}
              <a
                href="https://www.facebook.com/settings/?tab=ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://www.facebook.com/settings/?tab=ads
              </a>
            </p>
            <p className="mt-2">
              More information:{" "}
              <a
                href="https://www.facebook.com/privacy/policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                Meta Privacy Policy
              </a>
            </p>
          </div>
        </section>

        {/* ── 10. Hotjar ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            10. Hotjar
          </h2>
          <div className="mt-4">
            <p>
              We use Hotjar on our website, an analytics service provided by
              Hotjar Ltd., Dragonara Business Centre, 5th Floor, Dragonara Road,
              Paceville St Julian&apos;s STJ 3141, Malta (&ldquo;Hotjar&rdquo;).
              Hotjar enables us to analyse and better understand user behaviour
              on our website.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Data collected:</strong>
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Mouse movements, clicks, and scrolling behaviour (heatmaps)</li>
              <li>
                Session recordings (anonymised playback of user interactions)
              </li>
              <li>Device type, screen size, and browser type</li>
              <li>Geographic location (country level)</li>
              <li>Pages visited and time spent on pages</li>
            </ul>
            <p className="mt-2">
              Hotjar anonymises IP addresses and automatically masks sensitive
              input fields (e.g. password fields) in session recordings. No
              personal data such as email addresses or passwords is collected.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Purpose:</strong>{" "}
              Analysis of user behaviour through heatmaps and session recordings
              to improve the usability and design of our website.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Legal basis:</strong>{" "}
              Art. 6(1)(a) GDPR (consent via cookie consent banner). Hotjar is
              only activated after your explicit consent.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Opt-out:</strong> You can
              withdraw your consent at any time via our cookie consent banner.
              You can also disable tracking by Hotjar via the following link:{" "}
              <a
                href="https://www.hotjar.com/legal/compliance/opt-out"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://www.hotjar.com/legal/compliance/opt-out
              </a>
            </p>
            <p className="mt-2">
              More information:{" "}
              <a
                href="https://www.hotjar.com/legal/policies/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                Hotjar Privacy Policy
              </a>
            </p>
          </div>
        </section>

        {/* ── 11. Shopify ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            11. Shopify
          </h2>
          <div className="mt-4">
            <p>
              For our online shop, we use the e-commerce platform Shopify
              provided by Shopify International Limited, Victoria Buildings, 2nd
              Floor, 1-2 Haddington Road, Dublin 4, D04 XN32, Ireland
              (&ldquo;Shopify&rdquo;). Shopify provides us with the technical
              infrastructure for the operation of our online shop, including the
              processing of orders and payment processing.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Data collected:</strong>
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>
                Order data (name, address, email, phone number, products
                ordered)
              </li>
              <li>Payment data (processed by Shopify Payments)</li>
              <li>Shipping data</li>
              <li>Account information (if a customer account is created)</li>
              <li>Communication data (e.g. emails related to order processing)</li>
            </ul>
            <p className="mt-2">
              <strong className="text-ink-primary">Purpose:</strong>{" "}
              Order processing, payment processing, shipping, customer service,
              and compliance with statutory retention obligations.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">Legal basis:</strong>{" "}
              Art. 6(1)(b) GDPR (performance of a contract) for the processing
              of order and payment data, and Art. 6(1)(c) GDPR (legal
              obligation) for compliance with tax-related retention obligations.
            </p>
            <p className="mt-2">
              <strong className="text-ink-primary">
                Data transfer:
              </strong>{" "}
              Shopify may transfer data to servers in Canada and the USA. Shopify
              is certified under the EU-US Data Privacy Framework.
            </p>
            <p className="mt-2">
              More information:{" "}
              <a
                href="https://www.shopify.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                Shopify Privacy Policy
              </a>
            </p>
          </div>
        </section>

        {/* ── 12. Data Subject Rights ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            12. Data Subject Rights
          </h2>
          <div className="mt-4">
            <p>
              As a data subject, you have the following rights under the GDPR
              with regard to your personal data:
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">
                Right of access (Art. 15 GDPR)
              </strong>
            </p>
            <p className="mt-1">
              You have the right to obtain confirmation as to whether personal
              data concerning you is being processed. If this is the case, you
              have a right of access to such personal data and to the information
              specified in Art. 15 GDPR.
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">
                Right to rectification (Art. 16 GDPR)
              </strong>
            </p>
            <p className="mt-1">
              You have the right to obtain without undue delay the rectification
              of inaccurate personal data. Taking into account the purposes of
              the processing, you have the right to have incomplete personal data
              completed.
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">
                Right to erasure (Art. 17 GDPR)
              </strong>
            </p>
            <p className="mt-1">
              You have the right to obtain the erasure of personal data without
              undue delay where one of the grounds specified in Art. 17 GDPR
              applies, e.g. where the data is no longer necessary for the
              purposes for which it was collected.
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">
                Right to restriction of processing (Art. 18 GDPR)
              </strong>
            </p>
            <p className="mt-1">
              You have the right to obtain restriction of processing where one of
              the conditions specified in Art. 18 GDPR applies, e.g. where you
              contest the accuracy of the data.
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">
                Right to data portability (Art. 20 GDPR)
              </strong>
            </p>
            <p className="mt-1">
              You have the right to receive the personal data concerning you,
              which you have provided to us, in a structured, commonly used, and
              machine-readable format. You also have the right to transmit that
              data to another controller without hindrance.
            </p>

            <p className="mt-4">
              <strong className="text-ink-primary">
                Right to object (Art. 21 GDPR)
              </strong>
            </p>
            <p className="mt-1">
              You have the right to object, on grounds relating to your
              particular situation, at any time to the processing of personal
              data concerning you which is based on Art. 6(1)(e) or (f) GDPR.
              Where personal data is processed for direct marketing purposes, you
              have the right to object at any time to the processing.
            </p>

            <p className="mt-4">
              To exercise your rights, you can contact us at any time at:{" "}
              <a
                href="mailto:hello@vinkl.com"
                className="text-ink-primary underline underline-offset-2"
              >
                hello@vinkl.com
              </a>
            </p>
          </div>
        </section>

        {/* ── 13. Right to Lodge a Complaint ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            13. Right to Lodge a Complaint with a Supervisory Authority
          </h2>
          <div className="mt-4">
            <p>
              Without prejudice to any other administrative or judicial remedy,
              you have the right to lodge a complaint with a supervisory
              authority, in particular in the member state of your habitual
              residence, your place of work, or the place of the alleged
              infringement, if you consider that the processing of personal data
              relating to you infringes the GDPR (Art. 77 GDPR).
            </p>
            <p className="mt-2">
              The supervisory authority responsible for us is:
            </p>
            <p className="mt-2">
              Bavarian State Office for Data Protection Supervision (BayLDA)
            </p>
            <p>Promenade 18</p>
            <p>91522 Ansbach</p>
            <p>Germany</p>
            <p className="mt-2">
              Website:{" "}
              <a
                href="https://www.lda.bayern.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline underline-offset-2"
              >
                https://www.lda.bayern.de
              </a>
            </p>
          </div>
        </section>

        {/* ── 14. Changes to this Privacy Policy ── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            14. Changes to this Privacy Policy
          </h2>
          <div className="mt-4">
            <p>
              We reserve the right to amend this privacy policy to ensure it
              always complies with current legal requirements or to implement
              changes to our services in the privacy policy, e.g. when
              introducing new services. The new privacy policy will apply to your
              next visit.
            </p>
            <p className="mt-2">
              As of: March 2026
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}
