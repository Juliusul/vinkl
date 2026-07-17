import { Link, Section, Text } from "@react-email/components";
import {
  EHeading,
  EText,
  EmailShell,
  Kicker,
  email,
} from "./_components";

interface Props {
  customerName: string;
  trackingCode: string;
  trackingUrl?: string;
  shippingDaysDe?: string;
  shippingDaysIntl?: string;
  emailFooter?: string;
}

export function ShippingConfirmationEmail({
  customerName,
  trackingCode,
  trackingUrl,
  shippingDaysDe = "3–5 Werktage",
  shippingDaysIntl = "5–8 Werktage",
  emailFooter = "Fragen? Antworte einfach auf diese E-Mail — wir helfen gerne.",
}: Props) {
  const firstName = customerName.split(" ")[0] ?? customerName;

  const codeStyle = {
    fontSize: 17,
    letterSpacing: 1,
    color: email.inkPrimary,
    fontFamily: "'SF Mono', Consolas, 'Courier New', monospace",
    fontWeight: 500,
  } as const;

  return (
    <EmailShell
      preview="Dein VLip ist unterwegs"
      footerNote={emailFooter}
    >
      <Kicker>Versandbestätigung</Kicker>
      <EHeading>Es ist unterwegs, {firstName}.</EHeading>
      <EText>
        Dein VLip Teak-Wandregal ist auf dem Weg zu dir. Du kannst deine
        Sendung mit der folgenden Tracking-Nummer verfolgen.
      </EText>

      <Section
        style={{
          backgroundColor: email.bgWarm,
          padding: "28px 28px",
          margin: "28px 0",
          textAlign: "center" as const,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            letterSpacing: 1.8,
            textTransform: "uppercase" as const,
            color: email.inkTertiary,
            margin: "0 0 10px",
            fontFamily: email.fontBody,
            fontWeight: 500,
          }}
        >
          Sendungsverfolgung
        </Text>
        {trackingUrl ? (
          <Link href={trackingUrl} style={{ ...codeStyle, textDecoration: "underline" }}>
            {trackingCode}
          </Link>
        ) : (
          <Text style={{ ...codeStyle, margin: 0 }}>{trackingCode}</Text>
        )}
      </Section>

      <EText style={{ fontSize: 13, margin: 0 }}>
        Die Lieferung dauert in der Regel {shippingDaysDe} innerhalb
        Deutschlands, {shippingDaysIntl} nach Österreich und in die Schweiz.
      </EText>
    </EmailShell>
  );
}
