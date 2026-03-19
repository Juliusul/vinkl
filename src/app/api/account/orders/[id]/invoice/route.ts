import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";
import { generateInvoicePdf } from "@/lib/invoice/generate";
import { generateInvoiceNumber } from "@/lib/invoice/number";

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("customer_id", user.id)
    .single();

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id, { expand: ["line_items"] });
  const pdfBuffer = await generateInvoicePdf(session);
  const invoiceNumber = generateInvoiceNumber(session.id, session.created);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Rechnung-${invoiceNumber}.pdf"`,
    },
  });
}
