import { supabaseAdmin } from "./admin";

export async function getTemplateSettings(): Promise<Record<string, string>> {
  // Fallback-Werte aus Env-Vars
  const fallback: Record<string, string> = {
    seller_name: process.env.SELLER_NAME ?? "VINKL",
    seller_address: process.env.SELLER_ADDRESS ?? "",
    seller_vat_id: process.env.SELLER_VAT_ID ?? "",
    seller_iban: process.env.SELLER_IBAN ?? "",
    seller_bank: process.env.SELLER_BANK ?? "",
    seller_tax_rate: process.env.SELLER_TAX_RATE ?? "19",
    email_greeting: "Vielen Dank für deine Bestellung!",
    email_footer: "Bei Fragen antworte einfach auf diese E-Mail.",
    shipping_days_de: "3–5 Werktage",
    shipping_days_intl: "5–8 Werktage",
    return_policy: "30 Tage Rückgabe.",
  };

  try {
    const { data } = await supabaseAdmin.from("template_settings").select("key, value");
    if (!data || data.length === 0) return fallback;

    const fromDb: Record<string, string> = {};
    for (const row of data) {
      fromDb[row.key] = row.value;
    }
    return { ...fallback, ...fromDb };
  } catch {
    return fallback;
  }
}
