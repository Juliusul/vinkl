import type Stripe from "stripe";

/**
 * Fiktive Stripe Checkout Session für Template-Vorschauen.
 * Entspricht einer Bestellung über 299 € (1× VINKL Teak Wandregal).
 */
export const mockSession: Stripe.Checkout.Session = {
  id: "cs_test_preview_mock_0000000001",
  object: "checkout.session",
  created: Math.floor(new Date("2026-03-15T10:23:00Z").getTime() / 1000),
  amount_total: 29900,
  currency: "eur",
  payment_status: "paid",
  status: "complete",
  mode: "payment",
  customer_details: {
    name: "Max Mustermann",
    email: "max@mustermann.de",
    address: {
      line1: "Musterstraße 1",
      line2: null,
      city: "Berlin",
      postal_code: "10435",
      state: null,
      country: "DE",
    },
    phone: null,
    tax_exempt: "none",
    tax_ids: null,
  },
  metadata: {
    quantity: "1",
  },
  payment_intent: "pi_test_preview_mock_001",
  // Alle übrigen Felder die TypeScript erwartet:
  livemode: false,
  cancel_url: null,
  success_url: "https://vinkl.de/de/checkout/success",
  url: null,
  after_expiration: null,
  allow_promotion_codes: null,
  automatic_tax: { enabled: false, liability: null, status: null },
  billing_address_collection: null,
  client_reference_id: null,
  client_secret: null,
  collected_information: null,
  consent: null,
  consent_collection: null,
  currency_conversion: null,
  custom_fields: [],
  custom_text: {
    after_submit: null,
    shipping_address: null,
    submit: null,
    terms_of_service_acceptance: null,
  },
  customer: null,
  customer_creation: null,
  customer_email: null,
  expires_at: Math.floor(new Date("2026-03-15T11:23:00Z").getTime() / 1000),
  invoice: null,
  invoice_creation: null,
  line_items: undefined,
  locale: "de",
  payment_link: null,
  payment_method_collection: null,
  payment_method_configuration_details: null,
  payment_method_options: null,
  payment_method_types: ["card"],
  phone_number_collection: { enabled: false },
  recovered_from: null,
  redirect_on_completion: "always",
  return_url: null,
  saved_payment_method_options: null,
  setup_intent: null,
  shipping_address_collection: null,
  shipping_cost: null,
  shipping_details: null,
  shipping_options: [],
  submit_type: null,
  subscription: null,
  total_details: {
    amount_discount: 0,
    amount_shipping: 0,
    amount_tax: 0,
    breakdown: undefined,
  },
  ui_mode: "hosted",
  wallet_options: null,
} as unknown as Stripe.Checkout.Session;

/** Musterdaten für Versand-Vorschau */
export const mockTracking = {
  code: "1Z999AA10123456784",
  url: "https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=1Z999AA10123456784",
};

/** Musterdaten für Rückgabe/Umtausch/Erstattung */
export const mockRefund = {
  customerName: "Max Mustermann",
  customerEmail: "max@mustermann.de",
  invoiceNumber: "VINKL-2026-0001",
  amount: 299,
  currency: "EUR",
  reason: "Artikel entspricht nicht der Beschreibung",
  date: "15.03.2026",
};
