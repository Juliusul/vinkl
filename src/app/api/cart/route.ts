import { NextResponse } from "next/server";
import {
  getCart,
  createCart,
  addToCart,
  updateCartLine,
  removeFromCart,
} from "@/lib/shopify";

/**
 * Cart API Route — proxies all cart operations to Shopify.
 *
 * Actions: get, create-and-add, add, update, remove
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "get": {
        const cart = await getCart(body.cartId);
        return NextResponse.json({ cart });
      }

      case "create-and-add": {
        const newCart = await createCart();
        const cart = await addToCart(newCart.id, body.variantId, body.quantity ?? 1);
        return NextResponse.json({ cart });
      }

      case "add": {
        const cart = await addToCart(body.cartId, body.variantId, body.quantity ?? 1);
        return NextResponse.json({ cart });
      }

      case "update": {
        const cart = await updateCartLine(body.cartId, body.lineId, body.quantity);
        return NextResponse.json({ cart });
      }

      case "remove": {
        const cart = await removeFromCart(body.cartId, [body.lineId]);
        return NextResponse.json({ cart });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cart operation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
