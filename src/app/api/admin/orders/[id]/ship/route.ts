import { isAdminEmail } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/email/resend";
import { REPLY_TO_EMAIL, senderAddress } from "@/lib/email/domain";
import { ShippingConfirmationEmail } from "@/lib/email/templates/shipping-confirmation";
import { getTemplateSettings } from "@/lib/supabase/settings";
import { render as renderEmail } from "@react-email/components";
import React from "react";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { trackingCode, trackingUrl } = await req.json();
  if (!trackingCode) return NextResponse.json({ error: "trackingCode required" }, { status: 400 });

  const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", id).single();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  await supabaseAdmin.from("orders").update({
    status: "shipped",
    tracking_code: trackingCode,
    tracking_url: trackingUrl ?? null,
    shipped_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  await supabaseAdmin.from("order_events").insert({
    order_id: id,
    event_type: "shipped",
    data: { tracking_code: trackingCode, tracking_url: trackingUrl },
    created_by: user.email ?? "admin",
  });

  // Send shipping confirmation email
  try {
    const settings = await getTemplateSettings();
    const html = await renderEmail(
      React.createElement(ShippingConfirmationEmail, {
        customerName: order.customer_name ?? order.customer_email,
        trackingCode,
        trackingUrl,
        shippingDaysDe: settings.shipping_days_de,
        shippingDaysIntl: settings.shipping_days_intl,
        emailFooter: settings.email_footer,
      })
    );
    await resend.emails.send({
      from: senderAddress("versand"),
      replyTo: REPLY_TO_EMAIL,
      to: order.customer_email,
      subject: "Dein VINKL Regal ist unterwegs!",
      html,
    });
  } catch (err) {
    console.error("Shipping email error:", err);
  }

  return NextResponse.json({ success: true });
}
