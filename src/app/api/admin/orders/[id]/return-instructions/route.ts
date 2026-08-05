import { isAdminEmail } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/email/resend";
import { REPLY_TO_EMAIL, senderAddress } from "@/lib/email/domain";
import { ReturnInstructionsEmail } from "@/lib/email/templates/return-instructions";
import { getTemplateSettings } from "@/lib/supabase/settings";
import { render as renderEmail } from "@react-email/components";
import React from "react";

export const runtime = "nodejs";

/**
 * Manually triggered by admin once a customer asks to return an order.
 * Sends the return address up front — there's no self-service return
 * request flow yet, and the refund-notification email fires too late
 * (only after the item is already back) to serve as return instructions.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", id).single();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const settings = await getTemplateSettings();
  // Lager-/Rücksendeadresse ist BEWUSST getrennt von seller_address
  // (Impressum/Rechnung) — Regale werden nicht von der gemeldeten
  // Adresse aus verschickt. Ohne konfigurierten Wert lieber hart
  // abbrechen als versehentlich die falsche (rechtliche) Adresse in
  // eine Kundenmail zu schreiben.
  if (!settings.fulfillment_address) {
    return NextResponse.json(
      { error: "Keine Lager-/Rücksendeadresse konfiguriert. Bitte unter Admin → Templates → 'Versand & Rücksendung' eintragen." },
      { status: 400 }
    );
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
    return NextResponse.json({ error: sendError.message }, { status: 500 });
  }

  await supabaseAdmin.from("order_events").insert({
    order_id: id,
    event_type: "return_instructions_sent",
    data: {},
    created_by: user.email ?? "admin",
  });

  return NextResponse.json({ success: true });
}
