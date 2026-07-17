import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { LOGO_ASPECT_RATIO, LOGO_URL, REPLY_TO_EMAIL } from "@/lib/email/domain";
import type { CSSProperties, ReactNode } from "react";

/**
 * VINKL email design system — one visual language for every mail.
 *
 * Mirrors the website's tokens exactly (globals.css @theme): cream
 * ground, warm panels, ink text ramp, hairline borders, terracotta
 * accents, border-radius 0 throughout. Headings render in Plus
 * Jakarta Sans and body text in Inter where the client supports
 * web fonts (Apple Mail, iOS); everywhere else the stacks fall back
 * to Helvetica/Arial — the same fallbacks the site uses.
 */

// ── Tokens — keep in lockstep with src/app/globals.css ──
export const email = {
  bgCream: "#F5F0EB",
  bgWarm: "#EDE7E0",
  inkPrimary: "#2C2C2E",
  inkSecondary: "#6B6A6E",
  inkTertiary: "#9E9C9F",
  inkInverse: "#F5F0EB",
  terracotta: "#EF7928",
  border: "#D9D2CA",
  fontHeading: "'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif",
  fontBody: "Inter, 'Helvetica Neue', Arial, sans-serif",
} as const;

const JAKARTA_WOFF2 =
  "https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yw.woff2";
const INTER_WOFF2 =
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2";

// ── Shell — logo, cream ground, footer ──

interface ShellProps {
  preview: string;
  lang?: string;
  footerNote?: string;
  children: ReactNode;
}

export function EmailShell({ preview, lang = "de", footerNote, children }: ShellProps) {
  return (
    <Html lang={lang}>
      <Head>
        <Font
          fontFamily="Plus Jakarta Sans"
          fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
          webFont={{ url: JAKARTA_WOFF2, format: "woff2" }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
          webFont={{ url: INTER_WOFF2, format: "woff2" }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: email.bgCream,
          margin: 0,
          padding: "48px 16px",
          fontFamily: email.fontBody,
        }}
      >
        <Container style={{ maxWidth: 560, margin: "0 auto" }}>
          <Img
            src={LOGO_URL}
            alt="VINKL"
            height={26}
            width={Math.round(26 * LOGO_ASPECT_RATIO)}
            style={{ display: "block", margin: "0 0 40px" }}
          />

          {children}

          {/* Footer */}
          <Section style={{ marginTop: 48 }}>
            <div
              style={{
                borderTop: `1px solid ${email.border}`,
                paddingTop: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: email.inkTertiary,
                  margin: 0,
                  fontFamily: email.fontBody,
                }}
              >
                VINKL — Möbel für Räume, die es wirklich gibt.
                <br />
                <Link
                  href={`mailto:${REPLY_TO_EMAIL}`}
                  style={{ color: email.inkSecondary, textDecoration: "underline" }}
                >
                  {REPLY_TO_EMAIL}
                </Link>
              </Text>
              {footerNote && (
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 1.7,
                    color: email.inkTertiary,
                    margin: "12px 0 0",
                    fontFamily: email.fontBody,
                  }}
                >
                  {footerNote}
                </Text>
              )}
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Kicker — the site's section-label: terracotta dash + tracked caps ──

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 11,
        letterSpacing: 2.2,
        textTransform: "uppercase",
        color: email.inkTertiary,
        margin: "0 0 12px",
        fontFamily: email.fontBody,
        fontWeight: 500,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 16,
          height: 2,
          backgroundColor: email.terracotta,
          verticalAlign: "middle",
          marginRight: 12,
        }}
      />
      {children}
    </Text>
  );
}

// ── Heading — Jakarta Sans, like the site's h1/h2 ──

export function EHeading({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 26,
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
        fontWeight: 400,
        color: email.inkPrimary,
        margin: "0 0 20px",
        fontFamily: email.fontHeading,
      }}
    >
      {children}
    </Text>
  );
}

// ── Body text ──

export function EText({
  children,
  muted = true,
  style,
}: {
  children: ReactNode;
  muted?: boolean;
  style?: CSSProperties;
}) {
  return (
    <Text
      style={{
        fontSize: 15,
        lineHeight: 1.7,
        color: muted ? email.inkSecondary : email.inkPrimary,
        margin: "0 0 16px",
        fontFamily: email.fontBody,
        ...style,
      }}
    >
      {children}
    </Text>
  );
}

// ── Button — ink block, square, tracked caps (site CTA) ──

export function EButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        backgroundColor: email.inkPrimary,
        color: email.inkInverse,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: 2,
        textTransform: "uppercase",
        textDecoration: "none",
        padding: "16px 36px",
        borderRadius: 0,
        fontFamily: email.fontBody,
      }}
    >
      {children}
    </Link>
  );
}

// ── Panel — the site's bg-warm surface for data blocks ──

export function Panel({ children }: { children: ReactNode }) {
  return (
    <Section
      style={{
        backgroundColor: email.bgWarm,
        padding: "24px 28px",
        margin: "28px 0",
      }}
    >
      {children}
    </Section>
  );
}

// ── Data row — tracked caps label over ink value (product-page dl style) ──

export function DataRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: ReactNode;
  last?: boolean;
}) {
  return (
    <div style={{ marginBottom: last ? 0 : 16 }}>
      <Text
        style={{
          fontSize: 10,
          letterSpacing: 1.8,
          textTransform: "uppercase",
          color: email.inkTertiary,
          margin: "0 0 3px",
          fontFamily: email.fontBody,
          fontWeight: 500,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: email.inkPrimary,
          margin: 0,
          fontFamily: email.fontBody,
        }}
      >
        {value}
      </Text>
    </div>
  );
}

// ── Hairline ──

export function Hairline() {
  return (
    <div
      style={{
        borderTop: `1px solid ${email.border}`,
        margin: "28px 0",
      }}
    />
  );
}
