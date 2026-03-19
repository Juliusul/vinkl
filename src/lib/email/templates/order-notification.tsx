import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";
import type Stripe from "stripe";
import { generateInvoiceNumber } from "@/lib/invoice/number";

interface Props {
  session: Stripe.Checkout.Session;
}

export function OrderNotificationEmail({ session }: Props) {
  const invoiceNumber = generateInvoiceNumber(session.id, session.created);
  const customer = session.customer_details;
  const addr = customer?.address;
  const gross = ((session.amount_total ?? 0) / 100).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
  });
  const date = new Date(session.created * 1000).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <Html lang="de">
      <Head />
      <Preview>🛍 Neue Bestellung {invoiceNumber} — {gross} €</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f0f0f0", margin: 0, padding: "24px 0" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#fff", padding: "32px" }}>
          <Heading style={{ fontSize: 18, margin: "0 0 4px", color: "#1a1a1a" }}>
            Neue Bestellung eingegangen
          </Heading>
          <Text style={{ fontSize: 13, color: "#666", margin: "0 0 24px" }}>{date}</Text>

          <Hr style={{ margin: "0 0 24px" }} />

          <Section style={{ backgroundColor: "#f9f9f9", padding: "16px 20px", marginBottom: 24 }}>
            <Row style={{ marginBottom: 6 }}>
              <Column style={{ width: "40%" }}><Text style={{ fontSize: 12, color: "#666", margin: 0 }}>Bestellnummer</Text></Column>
              <Column><Text style={{ fontSize: 12, color: "#1a1a1a", fontWeight: "bold", margin: 0 }}>{invoiceNumber}</Text></Column>
            </Row>
            <Row style={{ marginBottom: 6 }}>
              <Column style={{ width: "40%" }}><Text style={{ fontSize: 12, color: "#666", margin: 0 }}>Stripe Session</Text></Column>
              <Column><Text style={{ fontSize: 11, color: "#555", margin: 0, fontFamily: "monospace" }}>{session.id}</Text></Column>
            </Row>
            <Row style={{ marginBottom: 6 }}>
              <Column style={{ width: "40%" }}><Text style={{ fontSize: 12, color: "#666", margin: 0 }}>Betrag</Text></Column>
              <Column><Text style={{ fontSize: 14, color: "#1a1a1a", fontWeight: "bold", margin: 0 }}>{gross} €</Text></Column>
            </Row>
          </Section>

          <Text style={{ fontSize: 11, letterSpacing: 1, color: "#888", textTransform: "uppercase", margin: "0 0 8px" }}>Kunde</Text>
          <Text style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.7, margin: "0 0 24px" }}>
            {customer?.name}<br />
            {customer?.email}<br />
            {addr && <>{addr.line1}, {addr.postal_code} {addr.city}, {addr.country}</>}
          </Text>

          <Hr style={{ margin: "0 0 16px" }} />

          <Text style={{ fontSize: 11, color: "#999", margin: 0 }}>
            Admin-Panel: {process.env.NEXT_PUBLIC_SITE_URL}/admin
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
