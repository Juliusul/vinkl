import { supabaseAdmin } from "./admin";

export async function getTemplateSettings(): Promise<Record<string, string>> {
  // Fallback-Werte aus Env-Vars
  const fallback: Record<string, string> = {
    seller_name: process.env.SELLER_NAME ?? "VINKL",
    // Inhaberin — ein Kleingewerbe hat keine eigene Rechtspersönlichkeit,
    // auf Rechnungen muss die natürliche Person stehen (Impressum-Daten).
    seller_owner: process.env.SELLER_OWNER ?? "Larissa Wagner",
    seller_address: process.env.SELLER_ADDRESS ?? "Haidberg 8, 93491 Stamsried",
    seller_vat_id: process.env.SELLER_VAT_ID ?? "",
    seller_tax_number: process.env.SELLER_TAX_NUMBER ?? "",
    seller_iban: process.env.SELLER_IBAN ?? "",
    seller_bank: process.env.SELLER_BANK ?? "",
    seller_tax_rate: process.env.SELLER_TAX_RATE ?? "19",
    // "true" → § 19 UStG: kein USt-Ausweis auf Rechnungen, Pflichthinweis
    // stattdessen. "false" → regulärer Ausweis mit seller_tax_rate.
    seller_kleinunternehmer: process.env.SELLER_KLEINUNTERNEHMER ?? "true",
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
