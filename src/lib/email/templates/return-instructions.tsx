import { DataRow, EHeading, EText, EmailShell, Kicker, Panel } from "./_components";

interface Props {
  customerName: string;
  invoiceNumber: string;
  sellerName: string;
  sellerAddress: string;
  emailReturnBody?: string;
  emailFooter?: string;
}

/**
 * Sent manually by admin once a customer asks to return an order —
 * NOT automatically, since there's no self-service return-request
 * flow yet. Gives the address to ship to before the item is on its
 * way, unlike RefundNotificationEmail (which fires only after the
 * refund itself, i.e. after the item should already be back).
 */
export function ReturnInstructionsEmail({
  customerName,
  invoiceNumber,
  sellerName,
  sellerAddress,
  emailReturnBody = "Schade, dass das VLip nicht bei dir bleibt. So schickst du es zurück:",
  emailFooter = "Bei Fragen antworte einfach auf diese E-Mail.",
}: Props) {
  const firstName = customerName.split(" ")[0] ?? customerName;

  return (
    <EmailShell
      preview={`So sendest du deine Bestellung ${invoiceNumber} zurück`}
      footerNote={emailFooter}
    >
      <Kicker>Rücksendung</Kicker>
      <EHeading>Rücksendung, {firstName}.</EHeading>
      <EText>{emailReturnBody}</EText>

      <Panel>
        <DataRow label="Bestellnummer" value={invoiceNumber} last={false} />
        <DataRow
          label="Rücksendeadresse"
          value={
            <>
              {sellerName}
              <br />
              {sellerAddress}
            </>
          }
          last
        />
      </Panel>

      <EText style={{ fontSize: 13 }}>
        Bitte lege der Sendung, wenn möglich, einen kurzen Hinweis mit deiner
        Bestellnummer bei. Die Rücksendung geht innerhalb von 14 Tagen ab
        Widerruf auf deine Kosten — sobald wir das VLip erhalten haben,
        erstatten wir den Kaufpreis.
      </EText>
    </EmailShell>
  );
}
