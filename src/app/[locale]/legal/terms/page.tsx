import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "AGB — VINKL",
};

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (locale === "en") return <TermsEN />;
  return <TermsDE />;
}

/* ── German ── */
function TermsDE() {
  return (
    <article className="mx-auto w-full max-w-[760px] px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <h1 className="font-serif text-3xl font-light tracking-tight md:text-4xl">
        Allgemeine Geschäftsbedingungen
      </h1>

      <div className="mt-10 space-y-8 text-sm leading-[1.8] text-ink-secondary">
        {/* — § 1 Geltungsbereich — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 1 Geltungsbereich
          </h2>
          <div className="mt-4">
            <p>
              (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend
              &bdquo;AGB&ldquo;) gelten für alle Verträge, die zwischen
            </p>
            <p className="mt-2">
              Larissa Wagner
              <br />
              Haidberg 8<br />
              93491 Stamsried
              <br />
              Deutschland
              <br />
              E-Mail: hello@vinkl.com
            </p>
            <p className="mt-2">
              — nachfolgend &bdquo;Verkäuferin&ldquo; — und dem Kunden
              (nachfolgend &bdquo;Kunde&ldquo;) über den Online-Shop
              vinkl.com geschlossen werden.
            </p>
            <p className="mt-2">
              (2) Maßgeblich ist die zum Zeitpunkt des Vertragsschlusses
              gültige Fassung dieser AGB.
            </p>
            <p className="mt-2">
              (3) Abweichende Bedingungen des Kunden werden nicht anerkannt,
              es sei denn, die Verkäuferin stimmt ihrer Geltung ausdrücklich
              schriftlich zu.
            </p>
            <p className="mt-2">
              (4) Diese AGB gelten sowohl gegenüber Verbrauchern im Sinne des
              § 13 BGB als auch gegenüber Unternehmern im Sinne des § 14 BGB,
              sofern nicht in einzelnen Klauseln eine abweichende Regelung
              getroffen wird.
            </p>
          </div>
        </section>

        {/* — § 2 Vertragsschluss — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 2 Vertragsschluss
          </h2>
          <div className="mt-4">
            <p>
              (1) Die Darstellung der Produkte im Online-Shop stellt kein
              rechtlich bindendes Angebot, sondern eine unverbindliche
              Aufforderung an den Kunden dar, Waren zu bestellen
              (invitatio ad offerendum).
            </p>
            <p className="mt-2">
              (2) Durch das Absenden der Bestellung über den Online-Shop gibt
              der Kunde ein verbindliches Angebot zum Kauf der im Warenkorb
              enthaltenen Waren ab. Mit dem Absenden der Bestellung erkennt
              der Kunde diese AGB als für das Vertragsverhältnis
              verbindlich an.
            </p>
            <p className="mt-2">
              (3) Die Verkäuferin bestätigt den Eingang der Bestellung
              unverzüglich per E-Mail (Eingangsbestätigung). Die
              Eingangsbestätigung stellt noch keine Annahme des
              Vertragsangebots dar.
            </p>
            <p className="mt-2">
              (4) Der Vertrag kommt erst zustande, wenn die Verkäuferin die
              bestellte Ware an den Kunden versendet oder den Versand per
              E-Mail bestätigt (Auftragsbestätigung).
            </p>
          </div>
        </section>

        {/* — § 3 Widerrufsrecht — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 3 Widerrufsrecht
          </h2>
          <div className="mt-4">
            <p className="font-medium text-ink-primary">Widerrufsbelehrung</p>
            <p className="mt-2">
              Verbraucher im Sinne des § 13 BGB haben bei Abschluss eines
              Fernabsatzvertrags grundsätzlich ein gesetzliches
              Widerrufsrecht, über das die Verkäuferin nach Maßgabe der
              folgenden Belehrung informiert:
            </p>

            <p className="mt-4 font-medium text-ink-primary">Widerrufsrecht</p>
            <p className="mt-2">
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von
              Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist
              beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen
              benannter Dritter, der nicht der Beförderer ist, die Waren in
              Besitz genommen haben bzw. hat.
            </p>
            <p className="mt-2">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
            </p>
            <p className="mt-2">
              Larissa Wagner
              <br />
              Haidberg 8<br />
              93491 Stamsried
              <br />
              E-Mail: hello@vinkl.com
            </p>
            <p className="mt-2">
              mittels einer eindeutigen Erklärung (z.&thinsp;B. ein mit der
              Post versandter Brief oder eine E-Mail) über Ihren Entschluss,
              diesen Vertrag zu widerrufen, informieren. Sie können dafür das
              beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht
              vorgeschrieben ist.
            </p>
            <p className="mt-2">
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die
              Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der
              Widerrufsfrist absenden.
            </p>

            <p className="mt-4 font-medium text-ink-primary">
              Folgen des Widerrufs
            </p>
            <p className="mt-2">
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle
              Zahlungen, die wir von Ihnen erhalten haben, einschließlich der
              Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich
              daraus ergeben, dass Sie eine andere Art der Lieferung als die
              von uns angebotene, günstigste Standardlieferung gewählt haben),
              unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
              zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses
              Vertrags bei uns eingegangen ist. Für diese Rückzahlung
              verwenden wir dasselbe Zahlungsmittel, das Sie bei der
              ursprünglichen Transaktion eingesetzt haben, es sei denn, mit
              Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem
              Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
            </p>
            <p className="mt-2">
              Wir können die Rückzahlung verweigern, bis wir die Waren wieder
              zurückerhalten haben oder bis Sie den Nachweis erbracht haben,
              dass Sie die Waren zurückgesandt haben, je nachdem, welches der
              frühere Zeitpunkt ist.
            </p>
            <p className="mt-2">
              Sie haben die Waren unverzüglich und in jedem Fall spätestens
              binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den
              Widerruf dieses Vertrags unterrichten, an uns zurückzusenden
              oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor
              Ablauf der Frist von vierzehn Tagen absenden.
            </p>
            <p className="mt-2">
              Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
            </p>
            <p className="mt-2">
              Sie müssen für einen etwaigen Wertverlust der Waren nur
              aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der
              Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht
              notwendigen Umgang mit ihnen zurückzuführen ist.
            </p>

            <p className="mt-4 font-medium text-ink-primary">
              Muster-Widerrufsformular
            </p>
            <p className="mt-2">
              (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte
              dieses Formular aus und senden Sie es zurück.)
            </p>
            <div className="mt-2 rounded border border-ink-primary/10 px-4 py-3">
              <p>
                An:
                <br />
                Larissa Wagner
                <br />
                Haidberg 8<br />
                93491 Stamsried
                <br />
                E-Mail: hello@vinkl.com
              </p>
              <p className="mt-2">
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
                abgeschlossenen Vertrag über den Kauf der folgenden Waren
                (*)/die Erbringung der folgenden Dienstleistung (*)
              </p>
              <p className="mt-2">Bestellt am (*)/erhalten am (*)</p>
              <p className="mt-2">Name des/der Verbraucher(s)</p>
              <p className="mt-2">Anschrift des/der Verbraucher(s)</p>
              <p className="mt-2">
                Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf
                Papier)
              </p>
              <p className="mt-2">Datum</p>
              <p className="mt-2 text-xs">(*) Unzutreffendes streichen.</p>
            </div>
          </div>
        </section>

        {/* — § 4 Preise und Zahlung — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 4 Preise und Zahlung
          </h2>
          <div className="mt-4">
            <p>
              (1) Alle im Online-Shop angegebenen Preise sind Endpreise und
              verstehen sich einschließlich der gesetzlichen
              Umsatzsteuer. Zusätzliche Liefer- und Versandkosten werden
              gesondert ausgewiesen.
            </p>
            <p className="mt-2">
              (2) Die Zahlung erfolgt über die im Online-Shop angebotenen
              Zahlungsarten. Der Kunde wählt die gewünschte Zahlungsart im
              Bestellvorgang aus.
            </p>
            <p className="mt-2">
              (3) Bei Auswahl einer Sofortzahlungsmethode ist der
              Kaufpreis unmittelbar nach Vertragsschluss fällig.
            </p>
          </div>
        </section>

        {/* — § 5 Lieferung und Versand — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 5 Lieferung und Versand
          </h2>
          <div className="mt-4">
            <p>
              (1) Die Lieferung erfolgt innerhalb Deutschlands. Der Versand
              innerhalb Deutschlands ist für den Kunden kostenfrei.
            </p>
            <p className="mt-2">
              (2) Die Lieferzeit entnehmen Sie der jeweiligen
              Produktbeschreibung. Sofern nicht anders angegeben, beträgt die
              Lieferzeit bis zu 10 Werktage nach Vertragsschluss (bei
              Vorauszahlung nach Zahlungseingang).
            </p>
            <p className="mt-2">
              (3) Sollte die bestellte Ware nicht verfügbar sein, behält sich
              die Verkäuferin vor, nicht zu liefern. In diesem Fall wird der
              Kunde unverzüglich über die Nichtverfügbarkeit informiert und
              bereits geleistete Zahlungen werden unverzüglich erstattet.
            </p>
            <p className="mt-2">
              (4) Das Risiko des zufälligen Untergangs und der zufälligen
              Verschlechterung der Ware geht bei Verbrauchern mit der
              Übergabe der Ware auf den Kunden über.
            </p>
          </div>
        </section>

        {/* — § 6 Eigentumsvorbehalt — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 6 Eigentumsvorbehalt
          </h2>
          <div className="mt-4">
            <p>
              Die gelieferte Ware bleibt bis zur vollständigen Bezahlung des
              Kaufpreises Eigentum der Verkäuferin.
            </p>
          </div>
        </section>

        {/* — § 7 Gewährleistung / Mängelhaftung — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 7 Gewährleistung und Mängelhaftung
          </h2>
          <div className="mt-4">
            <p>
              (1) Es gelten die gesetzlichen Gewährleistungsrechte.
            </p>
            <p className="mt-2">
              (2) Gegenüber Verbrauchern beträgt die Gewährleistungsfrist für
              neue Waren zwei Jahre ab Übergabe der Ware.
            </p>
            <p className="mt-2">
              (3) Gegenüber Unternehmern beträgt die Gewährleistungsfrist für
              neue Waren ein Jahr ab Übergabe der Ware.
            </p>
            <p className="mt-2">
              (4) Mängel hat der Kunde der Verkäuferin unverzüglich nach
              Entdeckung mitzuteilen. Zur Fristwahrung genügt die
              rechtzeitige Absendung der Mängelanzeige.
            </p>
          </div>
        </section>

        {/* — § 8 Haftungsbeschränkung — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 8 Haftungsbeschränkung
          </h2>
          <div className="mt-4">
            <p>
              (1) Die Verkäuferin haftet unbeschränkt für Schäden aus der
              Verletzung des Lebens, des Körpers oder der Gesundheit, die auf
              einer fahrlässigen oder vorsätzlichen Pflichtverletzung der
              Verkäuferin oder eines gesetzlichen Vertreters oder
              Erfüllungsgehilfen der Verkäuferin beruhen, sowie für Schäden,
              die von der Haftung nach dem Produkthaftungsgesetz umfasst
              werden, sowie für alle Schäden, die auf vorsätzlichen oder grob
              fahrlässigen Vertragsverletzungen sowie Arglist der Verkäuferin
              oder eines gesetzlichen Vertreters oder Erfüllungsgehilfen der
              Verkäuferin beruhen.
            </p>
            <p className="mt-2">
              (2) Bei leicht fahrlässiger Verletzung einer wesentlichen
              Vertragspflicht (Kardinalpflicht) haftet die Verkäuferin der
              Höhe nach begrenzt auf den bei Vertragsschluss vorhersehbaren,
              vertragstypischen Schaden. Wesentliche Vertragspflichten sind
              Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des
              Vertrags überhaupt erst ermöglicht und auf deren Einhaltung der
              Vertragspartner regelmäßig vertrauen darf.
            </p>
            <p className="mt-2">
              (3) Im Übrigen ist eine Haftung der Verkäuferin ausgeschlossen.
            </p>
            <p className="mt-2">
              (4) Die vorstehenden Haftungsbeschränkungen gelten auch für die
              persönliche Haftung der Mitarbeiter, Vertreter und
              Erfüllungsgehilfen der Verkäuferin.
            </p>
          </div>
        </section>

        {/* — § 9 Datenschutz — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 9 Datenschutz
          </h2>
          <div className="mt-4">
            <p>
              Die Verkäuferin verarbeitet personenbezogene Daten des Kunden
              zweckgebunden und gemäß den gesetzlichen Bestimmungen.
              Ausführliche Informationen zur Erhebung, Verarbeitung und
              Nutzung personenbezogener Daten finden Sie in unserer{" "}
              <a
                href="/legal/privacy"
                className="text-ink-primary underline underline-offset-2"
              >
                Datenschutzerklärung
              </a>
              .
            </p>
          </div>
        </section>

        {/* — § 10 Schlussbestimmungen — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 10 Schlussbestimmungen
          </h2>
          <div className="mt-4">
            <p>
              (1) Es gilt das Recht der Bundesrepublik Deutschland unter
              Ausschluss des UN-Kaufrechts (CISG). Gegenüber Verbrauchern
              gilt diese Rechtswahl nur insoweit, als nicht der gewährte
              Schutz durch zwingende Bestimmungen des Rechts des Staates, in
              dem der Verbraucher seinen gewöhnlichen Aufenthalt hat, entzogen
              wird.
            </p>
            <p className="mt-2">
              (2) Ist der Kunde Kaufmann, juristische Person des öffentlichen
              Rechts oder öffentlich-rechtliches Sondervermögen, ist
              ausschließlicher Gerichtsstand für alle Streitigkeiten aus
              diesem Vertrag der Geschäftssitz der Verkäuferin.
            </p>
            <p className="mt-2">
              (3) Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise
              unwirksam sein oder werden, so wird die Wirksamkeit der übrigen
              Bestimmungen hierdurch nicht berührt. Anstelle der unwirksamen
              Bestimmung gilt die gesetzliche Regelung.
            </p>
          </div>
        </section>

        <section>
          <p className="text-xs text-ink-secondary/60">
            Stand: März 2026
          </p>
        </section>
      </div>
    </article>
  );
}

/* ── English ── */
function TermsEN() {
  return (
    <article className="mx-auto w-full max-w-[760px] px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <h1 className="font-serif text-3xl font-light tracking-tight md:text-4xl">
        Terms &amp; Conditions
      </h1>

      <div className="mt-10 space-y-8 text-sm leading-[1.8] text-ink-secondary">
        {/* — § 1 Scope — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 1 Scope
          </h2>
          <div className="mt-4">
            <p>
              (1) These Terms &amp; Conditions (hereinafter &ldquo;T&amp;C&rdquo;)
              apply to all contracts concluded between
            </p>
            <p className="mt-2">
              Larissa Wagner
              <br />
              Haidberg 8<br />
              93491 Stamsried
              <br />
              Germany
              <br />
              Email: hello@vinkl.com
            </p>
            <p className="mt-2">
              — hereinafter referred to as &ldquo;Seller&rdquo; — and the
              customer (hereinafter &ldquo;Customer&rdquo;) via the online shop
              vinkl.com.
            </p>
            <p className="mt-2">
              (2) The version of these T&amp;C valid at the time the contract
              is concluded shall apply.
            </p>
            <p className="mt-2">
              (3) Deviating terms and conditions of the Customer shall not be
              recognised unless the Seller expressly agrees to their validity
              in writing.
            </p>
            <p className="mt-2">
              (4) These T&amp;C apply both to consumers within the meaning of
              § 13 BGB (German Civil Code) and to entrepreneurs within the
              meaning of § 14 BGB, unless a different provision is made in
              individual clauses.
            </p>
          </div>
        </section>

        {/* — § 2 Contract Formation — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 2 Contract Formation
          </h2>
          <div className="mt-4">
            <p>
              (1) The presentation of products in the online shop does not
              constitute a legally binding offer but rather a non-binding
              invitation to the Customer to place an order
              (invitatio ad offerendum).
            </p>
            <p className="mt-2">
              (2) By submitting an order through the online shop, the Customer
              makes a binding offer to purchase the goods contained in the
              shopping cart. By submitting the order, the Customer acknowledges
              these T&amp;C as binding for the contractual relationship.
            </p>
            <p className="mt-2">
              (3) The Seller confirms receipt of the order without delay by
              email (order confirmation of receipt). This confirmation of
              receipt does not yet constitute acceptance of the contractual
              offer.
            </p>
            <p className="mt-2">
              (4) The contract is only concluded when the Seller dispatches
              the ordered goods to the Customer or confirms the dispatch by
              email (order confirmation).
            </p>
          </div>
        </section>

        {/* — § 3 Right of Withdrawal — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 3 Right of Withdrawal
          </h2>
          <div className="mt-4">
            <p className="font-medium text-ink-primary">
              Cancellation Policy
            </p>
            <p className="mt-2">
              Consumers within the meaning of § 13 BGB are generally entitled
              to a statutory right of withdrawal when entering into a distance
              contract, about which the Seller provides the following
              information:
            </p>

            <p className="mt-4 font-medium text-ink-primary">
              Right of Withdrawal
            </p>
            <p className="mt-2">
              You have the right to withdraw from this contract within
              fourteen days without giving any reason. The withdrawal period
              is fourteen days from the day on which you, or a third party
              designated by you who is not the carrier, have taken possession
              of the goods.
            </p>
            <p className="mt-2">
              To exercise your right of withdrawal, you must inform us
            </p>
            <p className="mt-2">
              Larissa Wagner
              <br />
              Haidberg 8<br />
              93491 Stamsried
              <br />
              Email: hello@vinkl.com
            </p>
            <p className="mt-2">
              by means of a clear statement (e.g. a letter sent by post or an
              email) of your decision to withdraw from this contract. You may
              use the attached model withdrawal form for this purpose, but it
              is not mandatory.
            </p>
            <p className="mt-2">
              To meet the withdrawal deadline, it is sufficient for you to
              send the notification of the exercise of the right of withdrawal
              before the withdrawal period has expired.
            </p>

            <p className="mt-4 font-medium text-ink-primary">
              Consequences of Withdrawal
            </p>
            <p className="mt-2">
              If you withdraw from this contract, we shall reimburse all
              payments we have received from you, including delivery costs
              (with the exception of any additional costs resulting from your
              choosing a type of delivery other than the least expensive
              standard delivery offered by us), without undue delay and no
              later than fourteen days from the day on which we received
              notification of your withdrawal from this contract. For this
              reimbursement, we will use the same means of payment that you
              used for the original transaction, unless expressly agreed
              otherwise with you; in no event will you be charged any fees for
              this reimbursement.
            </p>
            <p className="mt-2">
              We may withhold reimbursement until we have received the goods
              back or until you have provided proof that you have returned the
              goods, whichever is the earlier.
            </p>
            <p className="mt-2">
              You must return the goods to us without undue delay and in any
              event no later than fourteen days from the day on which you
              inform us of the withdrawal from this contract. The deadline is
              met if you dispatch the goods before the fourteen-day period has
              expired.
            </p>
            <p className="mt-2">
              You shall bear the direct costs of returning the goods.
            </p>
            <p className="mt-2">
              You are only liable for any diminished value of the goods
              resulting from handling other than what is necessary to establish
              the nature, characteristics, and functioning of the goods.
            </p>

            <p className="mt-4 font-medium text-ink-primary">
              Model Withdrawal Form
            </p>
            <p className="mt-2">
              (If you wish to withdraw from the contract, please complete this
              form and send it back to us.)
            </p>
            <div className="mt-2 rounded border border-ink-primary/10 px-4 py-3">
              <p>
                To:
                <br />
                Larissa Wagner
                <br />
                Haidberg 8<br />
                93491 Stamsried
                <br />
                Email: hello@vinkl.com
              </p>
              <p className="mt-2">
                I/We (*) hereby revoke the contract concluded by me/us (*) for
                the purchase of the following goods (*)/the provision of the
                following service (*)
              </p>
              <p className="mt-2">Ordered on (*)/received on (*)</p>
              <p className="mt-2">Name of consumer(s)</p>
              <p className="mt-2">Address of consumer(s)</p>
              <p className="mt-2">
                Signature of consumer(s) (only for paper notifications)
              </p>
              <p className="mt-2">Date</p>
              <p className="mt-2 text-xs">(*) Delete as applicable.</p>
            </div>
          </div>
        </section>

        {/* — § 4 Prices and Payment — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 4 Prices and Payment
          </h2>
          <div className="mt-4">
            <p>
              (1) All prices stated in the online shop are final prices and
              include the applicable statutory value added tax. Additional
              delivery and shipping costs are shown separately.
            </p>
            <p className="mt-2">
              (2) Payment is made via the payment methods offered in the
              online shop. The Customer selects the desired payment method
              during the ordering process.
            </p>
            <p className="mt-2">
              (3) When an instant payment method is selected, the purchase
              price is due immediately upon conclusion of the contract.
            </p>
          </div>
        </section>

        {/* — § 5 Delivery and Shipping — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 5 Delivery and Shipping
          </h2>
          <div className="mt-4">
            <p>
              (1) Delivery is made within Germany. Shipping within Germany is
              free of charge for the Customer.
            </p>
            <p className="mt-2">
              (2) Please refer to the respective product description for the
              delivery time. Unless otherwise stated, the delivery time is up
              to 10 working days after conclusion of the contract (in the case
              of advance payment, after receipt of payment).
            </p>
            <p className="mt-2">
              (3) Should the ordered goods not be available, the Seller
              reserves the right not to deliver. In this case, the Customer
              will be informed of the unavailability without delay and any
              payments already made will be refunded immediately.
            </p>
            <p className="mt-2">
              (4) The risk of accidental loss and accidental deterioration of
              the goods passes to the Customer upon delivery of the goods to
              the consumer.
            </p>
          </div>
        </section>

        {/* — § 6 Retention of Title — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 6 Retention of Title
          </h2>
          <div className="mt-4">
            <p>
              The delivered goods remain the property of the Seller until the
              purchase price has been paid in full.
            </p>
          </div>
        </section>

        {/* — § 7 Warranty and Liability for Defects — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 7 Warranty and Liability for Defects
          </h2>
          <div className="mt-4">
            <p>
              (1) The statutory warranty rights shall apply.
            </p>
            <p className="mt-2">
              (2) For consumers, the warranty period for new goods is two
              years from delivery of the goods.
            </p>
            <p className="mt-2">
              (3) For entrepreneurs, the warranty period for new goods is one
              year from delivery of the goods.
            </p>
            <p className="mt-2">
              (4) The Customer must notify the Seller of any defects without
              delay after discovery. Timely dispatch of the notice of defect
              is sufficient to meet the deadline.
            </p>
          </div>
        </section>

        {/* — § 8 Limitation of Liability — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 8 Limitation of Liability
          </h2>
          <div className="mt-4">
            <p>
              (1) The Seller is liable without limitation for damages arising
              from injury to life, body, or health based on a negligent or
              intentional breach of duty by the Seller or a legal
              representative or vicarious agent of the Seller, as well as for
              damages covered by liability under the German Product Liability
              Act, and for all damages based on intentional or grossly
              negligent breaches of contract and fraud by the Seller or a
              legal representative or vicarious agent of the Seller.
            </p>
            <p className="mt-2">
              (2) In the event of a slightly negligent breach of a material
              contractual obligation (cardinal obligation), the Seller&apos;s
              liability is limited in amount to the foreseeable, typically
              occurring damage at the time of conclusion of the contract.
              Material contractual obligations are obligations whose
              fulfilment is essential for the proper execution of the contract
              and on whose compliance the contracting party may regularly
              rely.
            </p>
            <p className="mt-2">
              (3) Any further liability of the Seller is excluded.
            </p>
            <p className="mt-2">
              (4) The above limitations of liability also apply to the
              personal liability of the Seller&apos;s employees,
              representatives, and vicarious agents.
            </p>
          </div>
        </section>

        {/* — § 9 Data Protection — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 9 Data Protection
          </h2>
          <div className="mt-4">
            <p>
              The Seller processes the Customer&apos;s personal data for
              specific purposes and in accordance with statutory provisions.
              Detailed information on the collection, processing, and use of
              personal data can be found in our{" "}
              <a
                href="/legal/privacy"
                className="text-ink-primary underline underline-offset-2"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </section>

        {/* — § 10 Final Provisions — */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-primary">
            § 10 Final Provisions
          </h2>
          <div className="mt-4">
            <p>
              (1) The law of the Federal Republic of Germany shall apply to
              the exclusion of the UN Convention on Contracts for the
              International Sale of Goods (CISG). With regard to consumers,
              this choice of law shall only apply insofar as the protection
              granted by mandatory provisions of the law of the state in which
              the consumer has their habitual residence is not withdrawn.
            </p>
            <p className="mt-2">
              (2) If the Customer is a merchant, a legal entity under public
              law, or a special fund under public law, the exclusive place of
              jurisdiction for all disputes arising from this contract shall
              be the Seller&apos;s place of business.
            </p>
            <p className="mt-2">
              (3) Should individual provisions of these T&amp;C be or become
              wholly or partially invalid, the validity of the remaining
              provisions shall not be affected. The statutory provision shall
              apply in place of the invalid provision.
            </p>
          </div>
        </section>

        <section>
          <p className="text-xs text-ink-secondary/60">
            As of: March 2026
          </p>
        </section>
      </div>
    </article>
  );
}
