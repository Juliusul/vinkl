"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { Cart } from "@/types/cart";

// ── Cart API calls (client-side) ──
// We call Shopify directly from the client since the Storefront API
// is designed for public access with the storefront token.

const CART_STORAGE_KEY = "vinkl-cart-id";

async function cartFetch<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });
  if (!res.ok) {
    throw new Error(`Cart API error: ${res.status}`);
  }
  return res.json();
}

// ── Context types ──

interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  isAdding: boolean;
  isUpdating: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ──

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const initializedRef = useRef(false);

  // Load existing cart on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    async function loadCart() {
      const cartId = localStorage.getItem(CART_STORAGE_KEY);
      if (!cartId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await cartFetch<{ cart: Cart | null }>("get", { cartId });
        if (data.cart) {
          setCart(data.cart);
        } else {
          // Cart expired
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    }

    loadCart();
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    async (variantId: string, quantity: number = 1) => {
      setIsAdding(true);
      try {
        let currentCartId = cart?.id ?? localStorage.getItem(CART_STORAGE_KEY);

        if (!currentCartId) {
          // Create new cart and add item
          const data = await cartFetch<{ cart: Cart }>("create-and-add", {
            variantId,
            quantity,
          });
          localStorage.setItem(CART_STORAGE_KEY, data.cart.id);
          setCart(data.cart);
        } else {
          // Add to existing cart
          try {
            const data = await cartFetch<{ cart: Cart }>("add", {
              cartId: currentCartId,
              variantId,
              quantity,
            });
            setCart(data.cart);
          } catch {
            // Cart might be expired — create fresh
            localStorage.removeItem(CART_STORAGE_KEY);
            const data = await cartFetch<{ cart: Cart }>("create-and-add", {
              variantId,
              quantity,
            });
            localStorage.setItem(CART_STORAGE_KEY, data.cart.id);
            setCart(data.cart);
          }
        }
        setIsOpen(true);
      } finally {
        setIsAdding(false);
      }
    },
    [cart?.id],
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setIsUpdating(true);

      // Optimistic update
      const previousCart = cart;
      setCart((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lines: prev.lines.map((line) =>
            line.id === lineId ? { ...line, quantity } : line,
          ),
        };
      });

      try {
        const data = await cartFetch<{ cart: Cart }>("update", {
          cartId: cart.id,
          lineId,
          quantity,
        });
        setCart(data.cart);
      } catch {
        // Revert optimistic update
        setCart(previousCart);
      } finally {
        setIsUpdating(false);
      }
    },
    [cart],
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsUpdating(true);

      // Optimistic update
      const previousCart = cart;
      setCart((prev) => {
        if (!prev) return prev;
        const updatedLines = prev.lines.filter((line) => line.id !== lineId);
        return {
          ...prev,
          lines: updatedLines,
          totalQuantity: updatedLines.reduce((sum, l) => sum + l.quantity, 0),
        };
      });

      try {
        const data = await cartFetch<{ cart: Cart }>("remove", {
          cartId: cart.id,
          lineId,
        });
        setCart(data.cart);
      } catch {
        // Revert optimistic update
        setCart(previousCart);
      } finally {
        setIsUpdating(false);
      }
    },
    [cart],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isAdding,
        isUpdating,
        isOpen,
        openCart,
        closeCart,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ──

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
