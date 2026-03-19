export type OrderStatus = "paid" | "shipped" | "returned" | "exchanged" | "refunded";

export interface ShippingAddress {
  line1: string | null;
  line2: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
}

export interface Order {
  id: string;
  stripe_session_id: string;
  invoice_number: string;
  customer_id: string | null;
  customer_email: string;
  customer_name: string | null;
  shipping_address: ShippingAddress | null;
  amount_total: number; // in Cent
  currency: string;
  status: OrderStatus;
  tracking_code: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
  returned_at: string | null;
  refunded_at: string | null;
  refund_amount: number | null;
  stripe_refund_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  event_type: "confirmed" | "shipped" | "returned" | "exchanged" | "refunded" | "note_added" | "email_resent";
  data: Record<string, unknown>;
  created_by: string;
  created_at: string;
}
