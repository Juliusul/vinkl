import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateInvoicePdfFromPaymentIntent } from "@/lib/invoice/generate";
import { generateInvoiceNumber } from "@/lib/invoice/number";
import { mockPaymentIntent } from "@/lib/preview/mock-data";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoiceNumber = generateInvoiceNumber(mockPaymentIntent.id, mockPaymentIntent.created);
  const pdfBuffer = await generateInvoicePdfFromPaymentIntent(mockPaymentIntent, invoiceNumber);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=\"Rechnung-Vorschau.pdf\"",
    },
  });
}
