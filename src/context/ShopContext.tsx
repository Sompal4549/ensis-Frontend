"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  gstRate?: number;
}

export interface CartItem extends ShopProduct {
  quantity: number;
  finish?: string;
  size?: string;
}

export interface CartVariantOptions {
  finish?: string;
  size?: string;
}

export function cartItemKey(item: Pick<CartItem, "id" | "finish" | "size">) {
  return `${item.id}|${item.finish ?? ""}|${item.size ?? ""}`;
}

interface ShopContextValue {
  cartItems: CartItem[];
  likedItems: ShopProduct[];
  cartCount: number;
  likedCount: number;
  subtotal: number;
  addToCart: (product: ShopProduct, variant?: CartVariantOptions) => void;
  removeFromCart: (itemKey: string) => void;
  increaseQuantity: (itemKey: string) => void;
  decreaseQuantity: (itemKey: string) => void;
  clearCart: () => void;
  toggleLike: (product: ShopProduct) => void;
  isLiked: (productId: string) => boolean;
  isInCart: (productId: string, variant?: CartVariantOptions) => boolean;
}

const CART_STORAGE_KEY = "ensis_cart";
const LIKES_STORAGE_KEY = "ensis_liked_products";

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

function readStoredItems<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    readStoredItems<CartItem[]>(CART_STORAGE_KEY, [])
  );
  const [likedItems, setLikedItems] = useState<ShopProduct[]>(() =>
    readStoredItems<ShopProduct[]>(LIKES_STORAGE_KEY, [])
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedItems));
  }, [likedItems]);

  const addToCart = useCallback((product: ShopProduct, variant?: CartVariantOptions) => {
    setCartItems((items) => {
      const variantItem: CartItem = {
        ...product,
        finish: variant?.finish,
        size: variant?.size,
        quantity: 1,
      };
      const key = cartItemKey(variantItem);
      const existing = items.find((item) => cartItemKey(item) === key);

      if (existing) {
        return items.map((item) =>
          cartItemKey(item) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, variantItem];
    });
  }, []);

  const removeFromCart = useCallback((itemKey: string) => {
    setCartItems((items) => items.filter((item) => cartItemKey(item) !== itemKey));
  }, []);

  const increaseQuantity = useCallback((itemKey: string) => {
    setCartItems((items) =>
      items.map((item) =>
        cartItemKey(item) === itemKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((itemKey: string) => {
    setCartItems((items) =>
      items
        .map((item) =>
          cartItemKey(item) === itemKey
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const toggleLike = useCallback((product: ShopProduct) => {
    setLikedItems((items) => {
      const exists = items.some((item) => item.id === product.id);
      return exists
        ? items.filter((item) => item.id !== product.id)
        : [...items, product];
    });
  }, []);

  const isLiked = useCallback(
    (productId: string) => likedItems.some((item) => item.id === productId),
    [likedItems]
  );

  const isInCart = useCallback(
    (productId: string, variant?: CartVariantOptions) =>
      cartItems.some((item) => {
        if (item.id !== productId) return false;
        if (variant) {
          return (
            (item.finish ?? "") === (variant.finish ?? "") &&
            (item.size ?? "") === (variant.size ?? "")
          );
        }
        return true;
      }),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      likedItems,
      cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
      likedCount: likedItems.length,
      subtotal: cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      toggleLike,
      isLiked,
      isInCart,
    }),
    [
      cartItems,
      likedItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      toggleLike,
      isLiked,
      isInCart,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }

  return context;
}
