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
    <Html lang="de">
      <Head />
      <Preview>Dein Umtausch zur Bestellung {invoiceNumber} wurde bestätigt</Preview>
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
            Umtausch bestätigt, {firstName}.
          </Text>
          <Text style={{ fontSize: 14, color: "#666", margin: "0 0 32px", lineHeight: 1.6 }}>
            Wir haben deinen Umtausch zur Bestellung {invoiceNumber} erfasst.
            Wir bearbeiten deinen Umtausch und melden uns mit weiteren Informationen.
          </Text>

          <Section style={{ backgroundColor: "#f9f7f4", padding: "20px 24px", marginBottom: 32 }}>
            <Text style={{ fontSize: 9, letterSpacing: 2, color: "#888", textTransform: "uppercase", margin: "0 0 16px" }}>
              UMTAUSCH DETAILS
            </Text>
            <Row style={{ marginBottom: 8 }}>
              <Column><Text style={{ fontSize: 13, color: "#888", margin: 0 }}>Bestellnummer</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ fontSize: 13, color: "#1a1a1a", margin: 0 }}>{invoiceNumber}</Text></Column>
            </Row>
            <Row style={{ marginBottom: 8 }}>
              <Column><Text style={{ fontSize: 13, color: "#888", margin: 0 }}>Erfasst am</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ fontSize: 13, color: "#1a1a1a", margin: 0 }}>{exchangeDate}</Text></Column>
            </Row>
            <Row>
              <Column><Text style={{ fontSize: 13, color: "#888", margin: 0 }}>Status</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ fontSize: 13, color: "#c8933a", margin: 0 }}>In Bearbeitung</Text></Column>
            </Row>
          </Section>

          <Text style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: "0 0 32px" }}>
            Sobald wir dein Rückpaket erhalten haben, versenden wir das Ersatzprodukt umgehend.
            Du erhältst eine separate Versandbestätigung mit Tracking-Nummer.
          </Text>

          <Hr style={{ borderColor: "#e0d8d0", margin: "0 0 24px" }} />

          <Text style={{ fontSize: 12, color: "#999", lineHeight: 1.6, margin: 0 }}>
            {emailFooter}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
