import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";
import { PreviewTabs } from "@/components/admin/preview-tabs";
import { getTemplateSettings } from "@/lib/supabase/settings";
import { render as renderEmail } from "@react-email/components";
import React from "react";
import { OrderConfirmationEmail } from "@/lib/email/templates/order-confirmation";
import { ShippingConfirmationEmail } from "@/lib/email/templates/shipping-confirmation";
import { ReturnNotificationEmail } from "@/lib/email/templates/return-notification";
import { ExchangeNotificationEmail } from "@/lib/email/templates/exchange-notification";
import { RefundNotificationEmail } from "@/lib/email/templates/refund-notification";
import { mockPaymentIntent, mockTracking, mockRefund } from "@/lib/preview/mock-data";
import { generateInvoiceNumber } from "@/lib/invoice/number";

export default async function PreviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const settings = await getTemplateSettings();
  const invoiceNumber = generateInvoiceNumber(mockPaymentIntent.id, mockPaymentIntent.created);

  // Render all email templates to HTML strings server-side
  const [
    orderConfirmationHtml,
    shippingConfirmationHtml,
    returnNotificationHtml,
    exchangeNotificationHtml,
    refundNotificationHtml,
  ] = await Promise.all([
    renderEmail(React.createElement(OrderConfirmationEmail, {
      paymentIntent: mockPaymentIntent,
      invoiceNumber,
      emailGreeting: settings.email_greeting,
      emailFooter: settings.email_footer,
    })),
    renderEmail(React.createElement(ShippingConfirmationEmail, {
      customerName: mockRefund.customerName,
      trackingCode: mockTracking.code,
      trackingUrl: mockTracking.url,
      shippingDaysDe: settings.shipping_days_de,
      shippingDaysIntl: settings.shipping_days_intl,
      emailFooter: settings.email_footer,
    })),
    renderEmail(React.createElement(ReturnNotificationEmail, {
      customerName: mockRefund.customerName,
      invoiceNumber,
      returnPolicy: settings.return_policy,
      emailFooter: settings.email_footer,
    })),
    renderEmail(React.createElement(ExchangeNotificationEmail, {
      customerName: mockRefund.customerName,
      invoiceNumber,
      emailFooter: settings.email_footer,
    })),
    renderEmail(React.createElement(RefundNotificationEmail, {
      customerName: mockRefund.customerName,
      invoiceNumber,
      refundAmount: mockRefund.amount,
      currency: mockRefund.currency,
      emailFooter: settings.email_footer,
    })),
  ]);

  const tabs = [
    {
      key: "order-confirmation",
      label: "Bestellbestätigung",
      kind: "email" as const,
      html: orderConfirmationHtml,
    },
    {
      key: "invoice",
      label: "Rechnung (PDF)",
      kind: "pdf" as const,
      pdfUrl: `/api/admin/preview/invoice`,
    },
    {
      key: "shipping",
      label: "Versandbestätigung",
      kind: "email" as const,
      html: shippingConfirmationHtml,
    },
    {
      key: "return",
      label: "Rückgabe",
      kind: "email" as const,
      html: returnNotificationHtml,
    },
    {
      key: "exchange",
      label: "Umtausch",
      kind: "email" as const,
      html: exchangeNotificationHtml,
    },
    {
      key: "refund",
      label: "Erstattung",
      kind: "email" as const,
      html: refundNotificationHtml,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      <AdminNav locale={locale} active="previews" userEmail={user.email ?? ""} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 400, margin: "0 0 6px", color: "#1a1a1a" }}>
            Template-Vorschau
          </h1>
          <p style={{ fontSize: 12, color: "#888", margin: 0, fontFamily: "monospace" }}>
            Alle Vorlagen mit Musterdaten — Änderungen in Templates &amp; Einstellungen sind sofort sichtbar.
          </p>
        </div>

        {/* Mock data info box */}
        <div style={{
          backgroundColor: "#fff8ec",
          border: "1px solid #f0d9a0",
          borderRadius: 4,
          padding: "12px 16px",
          marginBottom: 28,
          fontSize: 12,
          color: "#8a6a00",
          fontFamily: "monospace",
        }}>
          Musterdaten: {mockRefund.customerName} · {mockRefund.customerEmail} · Bestellung {invoiceNumber} · 299,00 €
        </div>

        <PreviewTabs tabs={tabs} />
      </div>
    </div>
  );
}
