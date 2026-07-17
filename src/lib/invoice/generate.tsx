import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Path,
} from "@react-pdf/renderer";
import type Stripe from "stripe";
import { getTemplateSettings } from "@/lib/supabase/settings";
import { REPLY_TO_EMAIL } from "@/lib/email/domain";

/**
 * VINKL invoice PDF — same visual language as the site and the
 * transactional mails (src/lib/email/templates/_components.tsx):
 * cream ground, warm panel, ink text ramp, hairline borders,
 * terracotta accents, border-radius 0. Headings in Plus Jakarta
 * Sans, body in Inter — embedded as TTF (react-pdf can't read
 * the woff2 files the site/emails use).
 */

// ── Tokens — keep in lockstep with src/app/globals.css / email tokens ──
const C = {
  bgCream: "#F5F0EB",
  bgWarm: "#EDE7E0",
  inkPrimary: "#2C2C2E",
  inkSecondary: "#6B6A6E",
  inkTertiary: "#9E9C9F",
  terracotta: "#EF7928",
  border: "#D9D2CA",
} as const;

// Static-instance TTFs from fonts.gstatic.com — same families/weights
// the emails load as woff2. Fetched once per serverless instance.
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf", fontWeight: 500 },
  ],
});
Font.register({
  family: "Plus Jakarta Sans",
  fonts: [
    { src: "https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_qU7NSg.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_m07NSg.ttf", fontWeight: 500 },
  ],
});
// Addresses and invoice numbers must never hyphenate mid-word.
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    backgroundColor: C.bgCream,
    fontFamily: "Inter",
    fontSize: 10,
    color: C.inkPrimary,
    lineHeight: 1.5,
    padding: "52 56 100",
  },

  // Header: wordmark left, invoice meta right
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 },
  metaBlock: { alignItems: "flex-end" },
  kickerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  kickerDash: { width: 16, height: 2, backgroundColor: C.terracotta, marginRight: 10 },
  kickerText: { fontSize: 9, letterSpacing: 2.2, textTransform: "uppercase", color: C.inkTertiary, fontWeight: 500 },
  invoiceNumber: { fontFamily: "Plus Jakarta Sans", fontSize: 15, letterSpacing: -0.2, color: C.inkPrimary },
  invoiceDate: { fontSize: 9, color: C.inkSecondary, marginTop: 3 },

  // Address blocks — product-page dl style: tracked caps label over ink value
  addressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40 },
  addressBlock: { width: "45%" },
  label: { fontSize: 7.5, letterSpacing: 1.8, textTransform: "uppercase", color: C.inkTertiary, fontWeight: 500, marginBottom: 6 },
  addressLine: { fontSize: 9.5, lineHeight: 1.6, color: C.inkPrimary },

  // Line items
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.inkPrimary, paddingBottom: 6 },
  tableHeaderCell: { fontSize: 7.5, letterSpacing: 1.8, textTransform: "uppercase", color: C.inkTertiary, fontWeight: 500 },
  tableRow: { flexDirection: "row", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  col1: { width: "50%" },
  col2: { width: "14%", textAlign: "center" },
  col3: { width: "18%", textAlign: "right" },
  col4: { width: "18%", textAlign: "right" },
  itemName: { fontSize: 10, fontWeight: 500, color: C.inkPrimary },
  itemDesc: { fontSize: 8.5, color: C.inkSecondary, marginTop: 2, lineHeight: 1.5 },
  cellText: { fontSize: 10, color: C.inkPrimary },

  // Totals — warm panel for the final amount, like the email data panels
  totalsBlock: { alignItems: "flex-end", marginTop: 16 },
  totals: { width: 230 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  totalLabel: { fontSize: 9.5, color: C.inkSecondary },
  totalValue: { fontSize: 9.5, color: C.inkPrimary },
  grandTotal: { flexDirection: "row", justifyContent: "space-between", backgroundColor: C.bgWarm, padding: "10 14", marginTop: 8 },
  grandTotalText: { fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: 500, color: C.inkPrimary },

  // Paid stamp — terracotta outline, square, tracked caps
  paidRow: { flexDirection: "row", alignItems: "center", marginTop: 28 },
  paidStamp: { borderWidth: 1.4, borderColor: C.terracotta, padding: "5 12", marginRight: 14 },
  paidText: { fontSize: 9, letterSpacing: 2.4, textTransform: "uppercase", color: C.terracotta, fontWeight: 500 },
  paidNote: { fontSize: 8.5, color: C.inkSecondary },

  legalNote: { fontSize: 8, color: C.inkTertiary, marginTop: 20 },

  // Footer — hairline top, three muted columns
  footer: {
    position: "absolute",
    bottom: 44,
    left: 56,
    right: 56,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerCol: { fontSize: 7, lineHeight: 1.7, color: C.inkTertiary },
});

/**
 * Wordmark from public/logo/vinkl-wordmark.svg, inlined as vector
 * paths so it prints razor-sharp: VINK in ink, L in terracotta.
 */
function Wordmark({ height = 22 }: { height?: number }) {
  const ratio = 497.91 / 133.19;
  return (
    <Svg viewBox="0 0 497.91 133.19" style={{ height, width: height * ratio }}>
      <Path fill="#2b2b2b" d="M48.81,133.19L0,0h14.84l42.91,120.5h-2.86L97.62,0h15.02l-48.81,133.19h-15.02Z" />
      <Path fill="#2b2b2b" d="M130.33,133.19V0h14.3v133.19h-14.3Z" />
      <Path fill="#2b2b2b" d="M176.1,133.19V0h12.51l78.13,112.1h-4.83V0h14.3v133.19h-12.51L185.57,20.38h4.83v112.81h-14.3Z" />
      <Path fill="#2b2b2b" d="M307.68,133.19V0h14.3v77.77l-3.22-1.61L385.81,0h17.88l-53.81,61.14.71-10.19,56.32,82.24h-17.16l-45.41-65.61-22.35,25.39v40.23h-14.3Z" />
      <Path fill="#ef7928" d="M424.6,133.19V0h14.3v119.78h59v13.41h-73.3Z" />
    </Svg>
  );
}

function fmt(amount: number): string {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

export async function generateInvoicePdfFromPaymentIntent(
  pi: Stripe.PaymentIntent,
  invoiceNumber: string
): Promise<Buffer> {
  const settings = await getTemplateSettings();
  const TAX_RATE = parseInt(settings.seller_tax_rate ?? "19") / 100;
  // § 19 UStG (Kleinunternehmerregelung): keine USt ausweisen — ein
  // offener Steuerausweis würde die Steuer nach § 14c Abs. 2 UStG
  // trotzdem schulden. Stattdessen Pflichthinweis + Bruttobeträge.
  const kleinunternehmer = settings.seller_kleinunternehmer === "true";

  const invoiceDate = new Date(pi.created * 1000).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  const gross = (pi.amount ?? 0) / 100;
  const net = kleinunternehmer ? gross : gross / (1 + TAX_RATE);
  const tax = gross - net;
  // In der Positionstabelle: Kleinunternehmer rechnen brutto.
  const lineAmount = kleinunternehmer ? gross : net;

  const meta = pi.metadata ?? {};
  const customerName = pi.shipping?.name ?? meta.customer_name ?? "–";
  const customerEmail = meta.customer_email ?? "";
  const addr = pi.shipping?.address;
  const qty = meta.quantity ?? "1";

  const sellerName = settings.seller_name;
  const sellerOwner = settings.seller_owner;
  const sellerAddress = settings.seller_address;
  const sellerVatId = settings.seller_vat_id;
  const sellerTaxNumber = settings.seller_tax_number;
  const sellerIban = settings.seller_iban;
  const sellerBank = settings.seller_bank;
  // Kleinunternehmer führen i. d. R. keine USt-IdNr. — auf der Rechnung
  // steht dann die Steuernummer (§ 14 Abs. 4 Nr. 2 UStG verlangt eine
  // von beiden).
  const taxLine = kleinunternehmer
    ? (sellerTaxNumber ? `Steuernummer: ${sellerTaxNumber}` : "")
    : (sellerVatId ? `USt-IdNr.: ${sellerVatId}` : "");

  const doc = (
    <Document title={`Rechnung ${invoiceNumber}`} author={sellerName}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Wordmark />
          <View style={styles.metaBlock}>
            <View style={styles.kickerRow}>
              <View style={styles.kickerDash} />
              <Text style={styles.kickerText}>Rechnung</Text>
            </View>
            <Text style={styles.invoiceNumber}>Nr. {invoiceNumber}</Text>
            <Text style={styles.invoiceDate}>Datum: {invoiceDate}</Text>
          </View>
        </View>

        <View style={styles.addressRow}>
          <View style={styles.addressBlock}>
            <Text style={styles.label}>Verkäufer</Text>
            <Text style={styles.addressLine}>{sellerName}</Text>
            {sellerOwner ? <Text style={styles.addressLine}>{sellerOwner}</Text> : null}
            <Text style={styles.addressLine}>{sellerAddress}</Text>
            {taxLine ? <Text style={styles.addressLine}>{taxLine}</Text> : null}
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.label}>Käufer</Text>
            <Text style={styles.addressLine}>{customerName}</Text>
            {addr && (
              <>
                <Text style={styles.addressLine}>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</Text>
                <Text style={styles.addressLine}>{addr.postal_code} {addr.city}</Text>
                <Text style={styles.addressLine}>{addr.country}</Text>
              </>
            )}
            <Text style={styles.addressLine}>{customerEmail}</Text>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.col1]}>Beschreibung</Text>
          <Text style={[styles.tableHeaderCell, styles.col2]}>Menge</Text>
          <Text style={[styles.tableHeaderCell, styles.col3]}>Einzelpreis</Text>
          <Text style={[styles.tableHeaderCell, styles.col4]}>Gesamt</Text>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.col1}>
            <Text style={styles.itemName}>VLip — Teak-Wandregal</Text>
            <Text style={styles.itemDesc}>80 × 25 × 30 cm · Teakholz massiv · stufenlos verstellbar</Text>
          </View>
          <Text style={[styles.cellText, styles.col2]}>{qty}</Text>
          <Text style={[styles.cellText, styles.col3]}>{fmt(lineAmount / parseInt(qty))}</Text>
          <Text style={[styles.cellText, styles.col4]}>{fmt(lineAmount)}</Text>
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totals}>
            {!kleinunternehmer && (
              <>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Zwischensumme (netto)</Text>
                  <Text style={styles.totalValue}>{fmt(net)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>MwSt. {Math.round(TAX_RATE * 100)} %</Text>
                  <Text style={styles.totalValue}>{fmt(tax)}</Text>
                </View>
              </>
            )}
            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalText}>Gesamtbetrag</Text>
              <Text style={styles.grandTotalText}>{fmt(gross)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.paidRow}>
          <View style={styles.paidStamp}>
            <Text style={styles.paidText}>Bezahlt</Text>
          </View>
          <Text style={styles.paidNote}>Der Rechnungsbetrag wurde bereits vollständig beglichen.</Text>
        </View>

        {kleinunternehmer && (
          <Text style={styles.legalNote}>
            Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).
          </Text>
        )}
        <Text style={[styles.legalNote, kleinunternehmer ? { marginTop: 6 } : {}]}>
          Das Liefer- bzw. Leistungsdatum entspricht dem Rechnungsdatum.
        </Text>

        <View style={styles.footer} fixed>
          <Text style={styles.footerCol}>{sellerName} · {sellerOwner}{"\n"}{sellerAddress}</Text>
          <Text style={[styles.footerCol, { textAlign: "center" }]}>{taxLine || " "}{"\n"}{REPLY_TO_EMAIL}</Text>
          <Text style={[styles.footerCol, { textAlign: "right" }]}>{sellerIban ? `IBAN: ${sellerIban}` : " "}{"\n"}{sellerBank || " "}</Text>
        </View>
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
