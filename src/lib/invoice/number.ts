/**
 * Generates a deterministic invoice number from a Stripe session ID.
 * Format: VINKL-YYYY-NNNN
 *
 * Uses the last 4 hex chars of the session ID as a stable numeric suffix.
 * Not guaranteed sequential across all orders, but unique and human-readable.
 */
export function generateInvoiceNumber(sessionId: string, createdAt: number): string {
  const year = new Date(createdAt * 1000).getFullYear();
  // Take last 6 hex chars of session id, convert to decimal, mod 9999 → 4-digit padded
  const hex = sessionId.replace(/[^0-9a-f]/gi, "").slice(-6);
  const num = (parseInt(hex, 16) % 9999) + 1;
  const padded = String(num).padStart(4, "0");
  return `VINKL-${year}-${padded}`;
}
