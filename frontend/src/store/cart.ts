import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DELIVERY_FEE, FREE_DELIVERY_ABOVE } from '@/lib/constants';
import type { Product } from '@/types';

export type CartLine = {
  productId: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  mrp: number;
  stock: number;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  has: (productId: number) => boolean;
  count: () => number;
  itemsTotal: () => number;
  mrpTotal: () => number;
  deliveryFee: () => number;
  grandTotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === product.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === product.id
                  ? { ...l, quantity: Math.min(l.quantity + quantity, Math.max(product.stock, 1)) }
                  : l,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                productId: product.id,
                name: product.name,
                slug: product.slug,
                image: product.image,
                price: product.price,
                mrp: product.mrp,
                stock: product.stock,
                quantity,
              },
            ],
          };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.max(1, Math.min(quantity, Math.max(l.stock, 1))) }
              : l,
          ),
        })),

      remove: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),

      clear: () => set({ lines: [] }),

      has: (productId) => get().lines.some((l) => l.productId === productId),

      count: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),

      itemsTotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),

      mrpTotal: () => get().lines.reduce((sum, l) => sum + l.mrp * l.quantity, 0),

      deliveryFee: () => (get().itemsTotal() >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE),

      grandTotal: () => get().itemsTotal() + get().deliveryFee(),
    }),
    { name: 'nikunj.cart', partialize: (state) => ({ lines: state.lines }) },
  ),
);
