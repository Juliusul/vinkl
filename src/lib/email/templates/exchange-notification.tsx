import {
  DataRow,
  EHeading,
  EText,
  EmailShell,
  Kicker,
  Panel,
  email,
} from "./_components";

interface Props {
  customerName: string;
  invoiceNumber: string;
  exchangeDate?: string;
  emailFooter?: string;
}

export function ExchangeNotificationEmail({
  customerName,
  invoiceNumber,
  exchangeDate = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),
  emailFooter = "Bei Fragen antworte einfach auf diese E-Mail.",
}: Props) {
  const firstName = customerName.split(" ")[0] ?? customerName;

  return (
    <EmailShell
      preview={`Dein Umtausch zur Bestellung ${invoiceNumber} wurde bestätigt`}
      footerNote={emailFooter}
    >
      <Kicker>Umtausch</Kicker>
      <EHeading>Umtausch bestätigt, {firstName}.</EHeading>
      <EText>
        Wir haben deinen Umtausch zur Bestellung {invoiceNumber} erfasst und
        melden uns mit weiteren Informationen.
      </EText>

      <Panel>
        <DataRow label="Bestellnummer" value={invoiceNumber} />
        <DataRow label="Erfasst am" value={exchangeDate} />
        <DataRow
          label="Status"
          value={
            <span style={{ color: email.terracotta, fontWeight: 500 }}>
              In Bearbeitung
            </span>
          }
          last
        />
      </Panel>

      <EText style={{ fontSize: 13, margin: 0 }}>
        Sobald wir dein Rückpaket erhalten haben, versenden wir das
        Ersatzprodukt umgehend. Du erhältst eine separate Versandbestätigung
        mit Tracking-Nummer.
      </EText>
    </EmailShell>
  );
}
