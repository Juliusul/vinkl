import { resend } from "@/lib/email/resend";
import { REPLY_TO_EMAIL, senderAddress } from "@/lib/email/domain";
import { ReturnInstructionsEmail } from "@/lib/email/templates/return-instructions";
import { getTemplateSettings } from "@/lib/supabase/settings";
import { render as renderEmail } from "@react-email/components";
import React from "react";
import type { Order } from "@/types/order";

/**
 * Shared by the admin "Rücksende-Anleitung senden" button and the public
 * self-service /returns flow — one place that knows how to build and send
 * this mail, so both entry points stay in sync (and both refuse to send
 * if the real warehouse address isn't configured yet).
 */
export async function sendReturnInstructions(
  order: Order
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const settings = await getTemplateSettings();

  if (!settings.fulfillment_address) {
    return {
      ok: false,
      status: 400,
      error: "Keine Lager-/Rücksendeadresse konfiguriert. Bitte unter Admin → Templates → 'Versand & Rücksendung' eintragen.",
    };
  }

  const html = await renderEmail(
    React.createElement(ReturnInstructionsEmail, {
      customerName: order.customer_name ?? order.customer_email,
      invoiceNumber: order.invoice_number,
      returnToName: settings.fulfillment_name || settings.seller_owner || settings.seller_name,
      returnToAddress: settings.fulfillment_address,
      emailReturnBody: settings.email_return_body,
      emailFooter: settings.email_footer,
    })
  );

  const { error: sendError } = await resend.emails.send({
    from: senderAddress("bestellungen"),
    replyTo: REPLY_TO_EMAIL,
    to: order.customer_email,
    subject: `Rücksendung für Bestellung ${order.invoice_number}`,
    html,
  });
  if (sendError) {
    return { ok: false, status: 500, error: sendError.message };
  }

  return { ok: true };
}

/**
 * Legal 14-day Widerrufsfrist runs from delivery, which we don't track
 * precisely — shipped_at is the closest signal we have. return_window_days
 * (default 21) pads that for transit time. This is informational only:
 * it never blocks sending the address, it just flags the request for
 * admin review before deciding on a refund.
 */
export async function isWithinReturnWindow(order: Order): Promise<boolean> {
  const settings = await getTemplateSettings();
  const windowDays = parseInt(settings.return_window_days ?? "21") || 21;
  const anchor = order.shipped_at ?? order.created_at;
  const days = (Date.now() - new Date(anchor).getTime()) / (1000 * 60 * 60 * 24);
  return days <= windowDays;
}
