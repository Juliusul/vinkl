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

export function OrderConfirmationEmail({ session }: Props) {
  const invoiceNumber = generateInvoiceNumber(session.id, session.created);
  const customer = session.customer_details;
  const addr = customer?.address;
  const gross = ((session.amount_total ?? 0) / 100).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
  });

  return (
    <Html lang="de">
      <Head />
      <Preview>Deine VINKL Bestellung {invoiceNumber} ist eingegangen</Preview>
      <Body style={{ fontFamily: "Georgia, serif", backgroundColor: "#f5f0ea", margin: 0, padding: "32px 0" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#fff", padding: "48px 40px" }}>
          <Text style={{ fontSize: 11, letterSpacing: 3, color: "#888", textTransform: "uppercase", margin: "0 0 8px" }}>
            WANDREGAL
          </Text>
          <Heading style={{ fontSize: 28, fontWeight: 400, margin: "0 0 32px", color: "#1a1a1a" }}>
            VINKL
          </Heading>

          <Hr style={{ borderColor: "#e0d8d0", margin: "0 0 32px" }} />

          <Text style={{ fontSize: 16, color: "#1a1a1a", margin: "0 0 8px" }}>
            Vielen Dank für deine Bestellung, {customer?.name?.split(" ")[0] ?? ""}!
          </Text>
          <Text style={{ fontSize: 14, color: "#666", margin: "0 0 32px", lineHeight: 1.6 }}>
            Wir haben deine Bestellung erhalten und bereiten sie für den Versand vor.
            Die Rechnung findest du im Anhang dieser E-Mail.
          </Text>

          {/* Order details */}
          <Section style={{ backgroundColor: "#f9f7f4", padding: "20px 24px", marginBottom: 32 }}>
            <Text style={{ fontSize: 9, letterSpacing: 2, color: "#888", textTransform: "uppercase", margin: "0 0 16px" }}>
              BESTELLDETAILS
            </Text>
            <Row style={{ marginBottom: 8 }}>
              <Column><Text style={{ fontSize: 13, color: "#888", margin: 0 }}>Bestellnummer</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ fontSize: 13, color: "#1a1a1a", margin: 0 }}>{invoiceNumber}</Text></Column>
            </Row>
            <Row style={{ marginBottom: 8 }}>
              <Column><Text style={{ fontSize: 13, color: "#888", margin: 0 }}>Produkt</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ fontSize: 13, color: "#1a1a1a", margin: 0 }}>VINKL Teak Wandregal</Text></Column>
            </Row>
            <Row>
              <Column><Text style={{ fontSize: 13, color: "#888", margin: 0 }}>Gesamt</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ fontSize: 14, fontWeight: "bold", color: "#1a1a1a", margin: 0 }}>{gross} €</Text></Column>
            </Row>
          </Section>

          {/* Shipping address */}
          {addr && (
            <Section style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 9, letterSpacing: 2, color: "#888", textTransform: "uppercase", margin: "0 0 8px" }}>
                LIEFERADRESSE
              </Text>
              <Text style={{ fontSize: 13, color: "#1a1a1a", margin: 0, lineHeight: 1.7 }}>
                {customer?.name}<br />
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                {addr.postal_code} {addr.city}<br />
                {addr.country}
              </Text>
            </Section>
          )}

          <Hr style={{ borderColor: "#e0d8d0", margin: "0 0 24px" }} />

          <Text style={{ fontSize: 12, color: "#999", lineHeight: 1.6, margin: 0 }}>
            Bei Fragen antworte einfach auf diese E-Mail.<br />
            Wir melden uns sobald dein Regal unterwegs ist.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
