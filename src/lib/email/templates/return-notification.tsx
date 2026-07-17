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
  returnDate?: string;
  returnPolicy?: string;
  emailFooter?: string;
}

export function ReturnNotificationEmail({
  customerName,
  invoiceNumber,
  returnDate = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),
  returnPolicy = "30 Tage Rückgabe, Rücksendung kostenlos.",
  emailFooter = "Bei Fragen antworte einfach auf diese E-Mail.",
}: Props) {
  const firstName = customerName.split(" ")[0] ?? customerName;

  return (
    <EmailShell
      preview={`Deine Rückgabe zur Bestellung ${invoiceNumber} wurde erfasst`}
      footerNote={emailFooter}
    >
      <Kicker>Rückgabe</Kicker>
      <EHeading>Rückgabe erhalten, {firstName}.</EHeading>
      <EText>
        Wir haben deine Rückgabe zur Bestellung {invoiceNumber} erfasst.
        Sobald das Paket bei uns eingetroffen ist, werden wir dich
        informieren.
      </EText>

      <Panel>
        <DataRow label="Bestellnummer" value={invoiceNumber} />
        <DataRow label="Erfasst am" value={returnDate} />
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

      <EText style={{ fontSize: 13, margin: 0 }}>{returnPolicy}</EText>
    </EmailShell>
  );
}
