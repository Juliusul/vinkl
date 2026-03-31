import type Stripe from "stripe";

/**
 * Fiktive Stripe PaymentIntent für Template-Vorschauen.
 * Entspricht einer Bestellung über 299 € (1× VINKL Teak Wandregal).
 */
export const mockPaymentIntent: Stripe.PaymentIntent = {
  id: "pi_test_preview_mock_0000001",
  object: "payment_intent",
  created: Math.floor(new Date("2026-03-15T10:23:00Z").getTime() / 1000),
  amount: 29900,
  currency: "eur",
  status: "succeeded",
  metadata: {
    quantity: "1",
    locale: "de",
    customer_name: "Max Mustermann",
    customer_email: "max@mustermann.de",
    shipping_line1: "Musterstraße 1",
    shipping_city: "Berlin",
    shipping_postal_code: "10435",
    shipping_country: "DE",
  },
  shipping: {
    name: "Max Mustermann",
    address: {
      line1: "Musterstraße 1",
      line2: null,
      city: "Berlin",
      postal_code: "10435",
      state: null,
      country: "DE",
    },
    carrier: null,
    phone: null,
    tracking_number: null,
  },
  // Required fields
  amount_capturable: 0,
  amount_details: { tip: {} },
  amount_received: 29900,
  application: null,
  application_fee_amount: null,
  automatic_payment_methods: null,
  canceled_at: null,
  cancellation_reason: null,
  capture_method: "automatic",
  client_secret: null,
  confirmation_method: "automatic",
  customer: null,
  description: null,
  invoice: null,
  last_payment_error: null,
  latest_charge: null,
  livemode: false,
  next_action: null,
  on_behalf_of: null,
  payment_method: null,
  payment_method_configuration_details: null,
  payment_method_options: {},
  payment_method_types: ["card"],
  processing: null,
  receipt_email: "max@mustermann.de",
  review: null,
  setup_future_usage: null,
  source: null,
  statement_descriptor: null,
  statement_descriptor_suffix: null,
  transfer_data: null,
  transfer_group: null,
} as unknown as Stripe.PaymentIntent;

/** Backward compat alias */
export const mockSession = mockPaymentIntent;

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
