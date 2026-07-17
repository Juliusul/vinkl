import {
  DataRow,
  EHeading,
  EText,
  EmailShell,
  Kicker,
  Panel,
} from "./_components";

const SUCCESS = "#2D6A4F"; // --color-success from the site theme

interface Props {
  customerName: string;
  invoiceNumber: string;
  refundAmount: number;
  currency?: string;
  refundDate?: string;
  emailFooter?: string;
}

export function RefundNotificationEmail({
  customerName,
  invoiceNumber,
  refundAmount,
  currency = "EUR",
  refundDate = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),
  emailFooter = "Bei Fragen antworte einfach auf diese E-Mail.",
}: Props) {
  const firstName = customerName.split(" ")[0] ?? customerName;
  const formattedAmount = refundAmount.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <EmailShell
      preview={`Deine Erstattung über ${formattedAmount} € für Bestellung ${invoiceNumber}`}
      footerNote={emailFooter}
    >
      <Kicker>Erstattung</Kicker>
      <EHeading>Erstattung veranlasst, {firstName}.</EHeading>
      <EText>
        Wir haben eine Erstattung für deine Bestellung {invoiceNumber}{" "}
        veranlasst. Der Betrag wird innerhalb von 5–10 Werktagen auf deinem
        ursprünglichen Zahlungsmittel gutgeschrieben.
      </EText>

      <Panel>
        <DataRow label="Bestellnummer" value={invoiceNumber} />
        <DataRow label="Erstattungsdatum" value={refundDate} />
        <DataRow label="Währung" value={currency} />
        <DataRow
          label="Erstattungsbetrag"
          value={
            <span style={{ fontSize: 16, fontWeight: 500, color: SUCCESS }}>
              {formattedAmount} €
            </span>
          }
          last
        />
      </Panel>

      <EText style={{ fontSize: 13, margin: 0 }}>
        Bitte beachte, dass je nach Bank oder Zahlungsanbieter die Buchung
        einige Werktage in Anspruch nehmen kann.
      </EText>
    </EmailShell>
  );
}
