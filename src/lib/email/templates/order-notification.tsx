import type Stripe from "stripe";
import { Link, Text } from "@react-email/components";
import {
  DataRow,
  EHeading,
  EmailShell,
  Hairline,
  Kicker,
  Panel,
  email,
} from "./_components";

interface Props {
  paymentIntent: Stripe.PaymentIntent;
  invoiceNumber: string;
}

/** Internal owner/accounting notification — dense and factual. */
export function OrderNotificationEmail({ paymentIntent: pi, invoiceNumber }: Props) {
  const meta = pi.metadata ?? {};
  const customerName = pi.shipping?.name ?? meta.customer_name ?? "–";
  const customerEmail = meta.customer_email ?? "";
  const addr = pi.shipping?.address;
  const gross = ((pi.amount ?? 0) / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 });
  const date = new Date(pi.created * 1000).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vinkl-design.de"}/de/admin`;

  return (
    <EmailShell preview={`Neue Bestellung ${invoiceNumber} — ${gross} €`}>
      <Kicker>Neue Bestellung</Kicker>
      <EHeading>
        {gross} € — {invoiceNumber}
      </EHeading>
      <Text
        style={{
          fontSize: 13,
          color: email.inkTertiary,
          margin: "0 0 8px",
          fontFamily: email.fontBody,
        }}
      >
        {date}
      </Text>

      <Panel>
        <DataRow label="Bestellnummer" value={invoiceNumber} />
        <DataRow
          label="Payment Intent"
          value={
            <span style={{ fontFamily: "'SF Mono', Consolas, 'Courier New', monospace", fontSize: 12 }}>
              {pi.id}
            </span>
          }
        />
        <DataRow label="Menge" value={meta.quantity ?? "1"} />
        <DataRow
          label="Betrag"
          value={<span style={{ fontSize: 16, fontWeight: 500 }}>{gross} €</span>}
          last
        />
      </Panel>

      <DataRow
        label="Kunde"
        value={
          <>
            {customerName}
            <br />
            {customerEmail}
            {addr && (
              <>
                <br />
                {addr.line1}, {addr.postal_code} {addr.city}, {addr.country}
              </>
            )}
          </>
        }
        last
      />

      <Hairline />

      <Text
        style={{
          fontSize: 13,
          margin: 0,
          fontFamily: email.fontBody,
        }}
      >
        <Link href={adminUrl} style={{ color: email.inkSecondary, textDecoration: "underline" }}>
          Zum Admin-Panel
        </Link>
      </Text>
    </EmailShell>
  );
}
