import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  customerName: string;
  trackingCode: string;
  trackingUrl?: string;
}

export function ShippingConfirmationEmail({ customerName, trackingCode, trackingUrl }: Props) {
  const firstName = customerName.split(" ")[0] ?? customerName;

  return (
    <Html lang="de">
      <Head />
      <Preview>Dein VINKL Regal ist unterwegs 🚚</Preview>
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
            Es ist unterwegs, {firstName}!
          </Text>
          <Text style={{ fontSize: 14, color: "#666", margin: "0 0 32px", lineHeight: 1.6 }}>
            Dein VINKL Teak Wandregal ist auf dem Weg zu dir.
            Du kannst deine Sendung mit der folgenden Tracking-Nummer verfolgen.
          </Text>

          <Section style={{ backgroundColor: "#f9f7f4", padding: "20px 24px", marginBottom: 32, textAlign: "center" }}>
            <Text style={{ fontSize: 9, letterSpacing: 2, color: "#888", textTransform: "uppercase", margin: "0 0 8px" }}>
              SENDUNGSVERFOLGUNG
            </Text>
            {trackingUrl ? (
              <Link
                href={trackingUrl}
                style={{ fontSize: 16, color: "#1a1a1a", fontFamily: "monospace", fontWeight: "bold", textDecoration: "underline" }}
              >
                {trackingCode}
              </Link>
            ) : (
              <Text style={{ fontSize: 16, color: "#1a1a1a", fontFamily: "monospace", fontWeight: "bold", margin: 0 }}>
                {trackingCode}
              </Text>
            )}
          </Section>

          <Text style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: "0 0 32px" }}>
            Die Lieferung dauert in der Regel 3–5 Werktage innerhalb Deutschlands.
            Für Österreich und die Schweiz 5–8 Werktage.
          </Text>

          <Hr style={{ borderColor: "#e0d8d0", margin: "0 0 24px" }} />

          <Text style={{ fontSize: 12, color: "#999", lineHeight: 1.6, margin: 0 }}>
            Fragen? Antworte einfach auf diese E-Mail — wir helfen gerne.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
