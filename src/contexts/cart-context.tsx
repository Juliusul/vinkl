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
import type { Cart, CartLine } from "@/types/cart";
import { vinklProduct } from "@/data/products/vinkl";

// ── Storage ──

const CART_STORAGE_KEY = "vinkl-cart-lines";

interface StoredLine {
  lineId: string;
  variantId: string;
  quantity: number;
}

function buildCart(lines: StoredLine[]): Cart {
  const variant = vinklProduct.variants[0];
  const pricePerUnit = parseFloat(vinklProduct.price.amount);
  const currency = vinklProduct.price.currencyCode;
  const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0);
  const totalAmount = (pricePerUnit * totalQuantity).toFixed(2);

  const cartLines: CartLine[] = lines.map((l) => ({
    id: l.lineId,
    quantity: l.quantity,
    cost: {
      totalAmount: {
        amount: (pricePerUnit * l.quantity).toFixed(2),
        currencyCode: currency,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        title: vinklProduct.title,
        slug: vinklProduct.slug,
        featuredImage: vinklProduct.images[0],
      },
    },
  }));

  return {
    id: "local",
    checkoutUrl: "",
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount, currencyCode: currency },
      totalAmount: { amount: totalAmount, currencyCode: currency },
      totalTaxAmount: null,
    },
    lines: cartLines,
  };
}

function loadLines(): StoredLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLines(lines: StoredLine[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
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
  clearCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ──

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<StoredLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    setLines(loadLines());
    setIsLoading(false);
  }, []);

  // Persist to localStorage on every change (after init)
  useEffect(() => {
    if (!initializedRef.current) return;
    saveLines(lines);
  }, [lines]);

  const cart = lines.length > 0 ? buildCart(lines) : null;

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const clearCart = useCallback(() => {
    setLines([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const addItem = useCallback(async (variantId: string, quantity: number = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === variantId);
      if (existing) {
        return prev.map((l) =>
          l.variantId === variantId ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [
        ...prev,
        { lineId: `line-${Date.now()}`, variantId, quantity },
      ];
    });
    setIsOpen(true);
  }, []);

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    setLines((prev) =>
      prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l))
    );
  }, []);

  const removeItem = useCallback(async (lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isAdding: false,
        isUpdating: false,
        isOpen,
        openCart,
        closeCart,
        clearCart,
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
