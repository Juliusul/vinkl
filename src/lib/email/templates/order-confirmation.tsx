import type Stripe from "stripe";
import {
  DataRow,
  EHeading,
  EText,
  EmailShell,
  Hairline,
  Kicker,
  Panel,
  email,
} from "./_components";

interface Props {
  paymentIntent: Stripe.PaymentIntent;
  invoiceNumber: string;
  emailGreeting?: string;
  emailFooter?: string;
}

export function OrderConfirmationEmail({
  paymentIntent: pi,
  invoiceNumber,
  emailGreeting = "Vielen Dank für deine Bestellung!",
  emailFooter = "Bei Fragen antworte einfach auf diese E-Mail.",
}: Props) {
  const meta = pi.metadata ?? {};
  const customerName = pi.shipping?.name ?? meta.customer_name ?? "";
  const firstName = customerName.split(" ")[0] ?? "";
  const addr = pi.shipping?.address;
  const gross = ((pi.amount ?? 0) / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 });

  return (
    <EmailShell
      preview={`Deine VINKL Bestellung ${invoiceNumber} ist eingegangen`}
      footerNote="Wir melden uns, sobald dein Regal unterwegs ist."
    >
      <Kicker>Bestellbestätigung</Kicker>
      <EHeading>{emailGreeting.replace("{name}", firstName)}</EHeading>
      <EText>
        Wir haben deine Bestellung erhalten und bereiten sie für den Versand
        vor. Die Rechnung findest du im Anhang dieser E-Mail.
      </EText>

      <Panel>
        <DataRow label="Bestellnummer" value={invoiceNumber} />
        <DataRow
          label="Produkt"
          value={`VLip Teak-Wandregal × ${meta.quantity ?? "1"}`}
        />
        <DataRow
          label="Gesamt"
          value={
            <span style={{ fontSize: 16, fontWeight: 500 }}>{gross} €</span>
          }
          last
        />
      </Panel>

      {addr && (
        <>
          <DataRow
            label="Lieferadresse"
            value={
              <>
                {customerName}
                <br />
                {addr.line1}
                {addr.line2 ? `, ${addr.line2}` : ""}
                <br />
                {addr.postal_code} {addr.city}
                <br />
                {addr.country}
              </>
            }
            last
          />
          <Hairline />
        </>
      )}

      <EText style={{ margin: 0, fontSize: 13, color: email.inkTertiary }}>
        {emailFooter}
      </EText>
    </EmailShell>
  );
}
