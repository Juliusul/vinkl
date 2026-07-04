import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Text,
} from "@react-email/components";

interface Props {
  confirmUrl: string;
  preview: string;
  greeting: string;
  body: string;
  button: string;
  ignore: string;
}

/**
 * Waitlist double-opt-in email — one job, one button.
 * Visual language mirrors the order emails (cream, serif, hairlines).
 */
export function WaitlistConfirmationEmail({
  confirmUrl,
  preview,
  greeting,
  body,
  button,
  ignore,
}: Props) {
  return (
    <Html lang="de">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ fontFamily: "Georgia, serif", backgroundColor: "#f5f0ea", margin: 0, padding: "32px 0" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#fff", padding: "48px 40px" }}>
          <Text style={{ fontSize: 11, letterSpacing: 3, color: "#888", textTransform: "uppercase", margin: "0 0 8px" }}>
            WARTELISTE
          </Text>
          <Heading style={{ fontSize: 28, fontWeight: 400, margin: "0 0 32px", color: "#1a1a1a" }}>
            VINKL
          </Heading>

          <Hr style={{ borderColor: "#e0d8d0", margin: "0 0 32px" }} />

          <Text style={{ fontSize: 16, color: "#1a1a1a", margin: "0 0 8px" }}>
            {greeting}
          </Text>
          <Text style={{ fontSize: 14, color: "#666", margin: "0 0 32px", lineHeight: 1.6 }}>
            {body}
          </Text>

          <Button
            href={confirmUrl}
            style={{
              backgroundColor: "#2C2C2E",
              color: "#F5F0EB",
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "14px 32px",
            }}
          >
            {button}
          </Button>

          <Hr style={{ borderColor: "#e0d8d0", margin: "32px 0" }} />

          <Text style={{ fontSize: 12, color: "#999", margin: 0, lineHeight: 1.6 }}>
            {ignore}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
