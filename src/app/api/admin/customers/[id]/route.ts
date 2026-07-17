import { isAdminEmail } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

/**
 * Kundenkonto löschen.
 *
 * Bestellungen werden NICHT gelöscht — Rechnungen und Bestelldaten
 * unterliegen der Aufbewahrungspflicht (§ 147 AO). Sie werden nur vom
 * Konto getrennt (customer_id → null) und bleiben über die E-Mail im
 * Admin auffindbar.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { data: { user: customer }, error: getError } =
    await supabaseAdmin.auth.admin.getUserById(id);
  if (getError || !customer) {
    return NextResponse.json({ error: "Kunde nicht gefunden" }, { status: 404 });
  }
  // Admin-Konten nicht über die Kundenverwaltung löschbar.
  if (isAdminEmail(customer.email)) {
    return NextResponse.json({ error: "Admin-Konten können hier nicht gelöscht werden" }, { status: 403 });
  }

  const { error: unlinkError } = await supabaseAdmin
    .from("orders")
    .update({ customer_id: null })
    .eq("customer_id", id);
  if (unlinkError) {
    return NextResponse.json({ error: `Bestellungen konnten nicht getrennt werden: ${unlinkError.message}` }, { status: 500 });
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

/** Aktionen: { action: "resend_confirmation" } — Bestätigungsmail erneut senden. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { action } = await req.json().catch(() => ({}));

  if (action !== "resend_confirmation") {
    return NextResponse.json({ error: "Unbekannte Aktion" }, { status: 400 });
  }

  const { data: { user: customer }, error: getError } =
    await supabaseAdmin.auth.admin.getUserById(id);
  if (getError || !customer?.email) {
    return NextResponse.json({ error: "Kunde nicht gefunden" }, { status: 404 });
  }
  if (customer.email_confirmed_at) {
    return NextResponse.json({ error: "Konto ist bereits bestätigt" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinkl-design.de";
  // resend ist ein öffentlicher GoTrue-Endpoint — der Server-Client
  // (anon key, ohne Session) reicht dafür aus.
  const supabase = await createSupabaseServerClient();
  const { error: resendError } = await supabase.auth.resend({
    type: "signup",
    email: customer.email,
    options: { emailRedirectTo: `${siteUrl}/auth/confirm?next=/de/account/orders` },
  });
  if (resendError) {
    return NextResponse.json({ error: resendError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
