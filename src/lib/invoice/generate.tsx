import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type Stripe from "stripe";
import { generateInvoiceNumber } from "./number";
import { getTemplateSettings } from "@/lib/supabase/settings";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 48,
    color: "#1a1a1a",
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  brand: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },
  metaBlock: {
    fontSize: 9,
    color: "#666",
    textAlign: "right",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginVertical: 20,
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  addressBlock: {
    width: "45%",
  },
  label: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: "6 8",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    padding: "8 8",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  col1: { width: "50%", fontSize: 10 },
  col2: { width: "15%", textAlign: "center", fontSize: 10 },
  col3: { width: "17.5%", textAlign: "right", fontSize: 10 },
  col4: { width: "17.5%", textAlign: "right", fontSize: 10 },
  totalsBlock: {
    alignItems: "flex-end",
    marginTop: 16,
  },
  totalRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalRowBold: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    marginTop: 4,
  },
  boldText: {
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 48,
    right: 48,
    fontSize: 8,
    color: "#999",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paidStamp: {
    marginTop: 24,
    alignSelf: "flex-start",
    borderWidth: 2,
    borderColor: "#2d7a2d",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  paidText: {
    color: "#2d7a2d",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    letterSpacing: 2,
  },
});

function fmt(amount: number): string {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

export async function generateInvoicePdf(
  session: Stripe.Checkout.Session
): Promise<Buffer> {
  const settings = await getTemplateSettings();
  const TAX_RATE = parseInt(settings.seller_tax_rate ?? "19") / 100;

  const invoiceNumber = generateInvoiceNumber(session.id, session.created);
  const invoiceDate = new Date(session.created * 1000).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  const gross = (session.amount_total ?? 0) / 100;
  const net = gross / (1 + TAX_RATE);
  const tax = gross - net;

  const customer = session.customer_details;
  const addr = customer?.address;

  const sellerName = settings.seller_name;
  const sellerAddress = settings.seller_address;
  const sellerVatId = settings.seller_vat_id;
  const sellerIban = settings.seller_iban;
  const sellerBank = settings.seller_bank;

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>VINKL</Text>
          <View style={styles.metaBlock}>
            <Text>Rechnung</Text>
            <Text>Nr. {invoiceNumber}</Text>
            <Text>Datum: {invoiceDate}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Addresses */}
        <View style={styles.addressRow}>
          <View style={styles.addressBlock}>
            <Text style={styles.label}>Verkäufer</Text>
            <Text>{sellerName}</Text>
            <Text>{sellerAddress}</Text>
            <Text>USt-IdNr.: {sellerVatId}</Text>
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.label}>Käufer</Text>
            <Text>{customer?.name ?? "–"}</Text>
            {addr && (
              <>
                <Text>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</Text>
                <Text>{addr.postal_code} {addr.city}</Text>
                <Text>{addr.country}</Text>
              </>
            )}
            <Text>{customer?.email ?? ""}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Beschreibung</Text>
          <Text style={styles.col2}>Menge</Text>
          <Text style={styles.col3}>Einzelpreis</Text>
          <Text style={styles.col4}>Gesamt</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.col1}>VINKL Teak Wandregal{"\n"}(80 × 25 × 30 cm, Teakholz massiv)</Text>
          <Text style={styles.col2}>{session.metadata?.quantity ?? "1"}</Text>
          <Text style={styles.col3}>{fmt(net)}</Text>
          <Text style={styles.col4}>{fmt(net)}</Text>
        </View>

        {/* Totals */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text>Netto</Text>
            <Text>{fmt(net)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>MwSt. {Math.round(TAX_RATE * 100)}%</Text>
            <Text>{fmt(tax)}</Text>
          </View>
          <View style={styles.totalRowBold}>
            <Text style={styles.boldText}>Gesamt</Text>
            <Text style={styles.boldText}>{fmt(gross)}</Text>
          </View>
        </View>

        {/* Paid stamp */}
        <View style={styles.paidStamp}>
          <Text style={styles.paidText}>BEZAHLT</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{sellerName} · {sellerAddress}</Text>
          <Text>IBAN: {sellerIban} · {sellerBank}</Text>
        </View>
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
