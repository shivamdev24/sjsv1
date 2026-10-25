"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type { DynamicProductData } from "@/components/Product/productCard";

interface CartItem {
  product: DynamicProductData;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  addToCart: (product: DynamicProductData) => void;
  removeFromCart: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: DynamicProductData) => {
    setItems((currentItems) => {
      const existing = currentItems.find(
        (item) => item.product.id === product.id,
      );

      if (existing) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
    );
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, cartCount, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
