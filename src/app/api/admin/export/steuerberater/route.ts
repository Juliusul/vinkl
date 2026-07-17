import { isAdminEmail } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";
import { generateInvoicePdfFromPaymentIntent } from "@/lib/invoice/generate";
import { getTemplateSettings } from "@/lib/supabase/settings";
import type { Order } from "@/types/order";
import JSZip from "jszip";

export const runtime = "nodejs";
export const maxDuration = 60;

const STATUS_DE: Record<string, string> = {
  paid: "Bezahlt",
  shipped: "Versandt",
  returned: "Rückgabe",
  exchanged: "Umtausch",
  refunded: "Erstattet",
};

function eur(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

/** Semikolon-CSV, Feldwerte defensiv gequotet (deutsches Excel). */
function csvRow(fields: (string | number)[]): string {
  return fields
    .map((f) => {
      const s = String(f);
      return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    })
    .join(";");
}

/**
 * Steuerberater-Export: ZIP mit Bestell-CSV + allen Rechnungs-PDFs
 * des Zeitraums. GET ?year=2026[&month=7]
 */
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const year = parseInt(params.get("year") ?? "") || new Date().getFullYear();
  const monthRaw = parseInt(params.get("month") ?? "");
  const month = monthRaw >= 1 && monthRaw <= 12 ? monthRaw : null;

  const from = month ? new Date(Date.UTC(year, month - 1, 1)) : new Date(Date.UTC(year, 0, 1));
  const to = month ? new Date(Date.UTC(year, month, 1)) : new Date(Date.UTC(year + 1, 0, 1));

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .gte("created_at", from.toISOString())
    .lt("created_at", to.toISOString())
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settings = await getTemplateSettings();
  const kleinunternehmer = settings.seller_kleinunternehmer === "true";
  const taxRate = parseInt(settings.seller_tax_rate ?? "19") / 100;

  const zip = new JSZip();
  const invoiceFolder = zip.folder("Rechnungen")!;
  const pdfErrors: string[] = [];

  // ── CSV ──
  const header = kleinunternehmer
    ? ["Rechnungsnummer", "Datum", "Kunde", "E-Mail", "Land", "Status", "Betrag (EUR)", "Erstattet (EUR)", "Stripe-Referenz"]
    : ["Rechnungsnummer", "Datum", "Kunde", "E-Mail", "Land", "Status", "Brutto (EUR)", "Netto (EUR)", `USt ${Math.round(taxRate * 100)}% (EUR)`, "Erstattet (EUR)", "Stripe-Referenz"];

  const rows: string[] = [csvRow(header)];
  let sumGross = 0;
  let sumRefunded = 0;

  for (const order of (orders ?? []) as Order[]) {
    const date = new Date(order.created_at).toLocaleDateString("de-DE");
    const refunded = order.refund_amount ?? 0;
    sumGross += order.amount_total;
    sumRefunded += refunded;

    if (kleinunternehmer) {
      rows.push(csvRow([
        order.invoice_number, date, order.customer_name ?? "", order.customer_email,
        order.shipping_address?.country ?? "", STATUS_DE[order.status] ?? order.status,
        eur(order.amount_total), refunded ? eur(refunded) : "", order.stripe_session_id,
      ]));
    } else {
      const net = order.amount_total / (1 + taxRate);
      rows.push(csvRow([
        order.invoice_number, date, order.customer_name ?? "", order.customer_email,
        order.shipping_address?.country ?? "", STATUS_DE[order.status] ?? order.status,
        eur(order.amount_total), eur(Math.round(net)), eur(order.amount_total - Math.round(net)),
        refunded ? eur(refunded) : "", order.stripe_session_id,
      ]));
    }

    // ── Rechnungs-PDF aus dem Stripe PaymentIntent regenerieren ──
    try {
      const pi = await stripe.paymentIntents.retrieve(order.stripe_session_id);
      const pdf = await generateInvoicePdfFromPaymentIntent(pi, order.invoice_number);
      invoiceFolder.file(`Rechnung-${order.invoice_number}.pdf`, pdf);
    } catch (err) {
      pdfErrors.push(`${order.invoice_number}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Summenzeile
  const pad = Array(5).fill("");
  if (kleinunternehmer) {
    rows.push(csvRow(["SUMME", ...pad, eur(sumGross), eur(sumRefunded), ""]));
  } else {
    const sumNet = Math.round(sumGross / (1 + taxRate));
    rows.push(csvRow(["SUMME", ...pad, eur(sumGross), eur(sumNet), eur(sumGross - sumNet), eur(sumRefunded), ""]));
  }

  // BOM (U+FEFF), damit deutsches Excel Umlaute korrekt öffnet
  zip.file("Bestellungen.csv", String.fromCharCode(0xfeff) + rows.join("\r\n"));

  const period = month ? `${String(month).padStart(2, "0")}/${year}` : String(year);
  const liesmich = [
    `VINKL — Steuerberater-Export`,
    `Zeitraum: ${period}`,
    `Erstellt: ${new Date().toLocaleString("de-DE")}`,
    ``,
    `Inhalt:`,
    `- Bestellungen.csv — alle Bestellungen des Zeitraums (Semikolon-getrennt, für Excel).`,
    `- Rechnungen/ — alle ausgestellten Rechnungen als PDF.`,
    ``,
    kleinunternehmer
      ? `Hinweis: Es gilt die Kleinunternehmerregelung nach § 19 UStG — auf den Rechnungen wird keine Umsatzsteuer ausgewiesen.`
      : `Hinweis: Beträge inkl. ${Math.round(taxRate * 100)}% USt; Netto/USt-Spalten in der CSV.`,
    ``,
    `Erstattungen sind in der CSV vermerkt (Spalte "Erstattet"). Die zugehörigen`,
    `Stripe-Belege (Auszahlungen, Gebühren) finden sich im Stripe-Dashboard unter`,
    `der jeweiligen Stripe-Referenz.`,
    ...(pdfErrors.length
      ? [``, `ACHTUNG — folgende Rechnungs-PDFs konnten nicht erzeugt werden:`, ...pdfErrors.map((e) => `- ${e}`)]
      : []),
  ].join("\r\n");
  zip.file("LIESMICH.txt", liesmich);

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  const filename = month
    ? `VINKL-Steuerberater-${year}-${String(month).padStart(2, "0")}.zip`
    : `VINKL-Steuerberater-${year}.zip`;

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
