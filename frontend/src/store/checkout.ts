import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type DeliveryAddress = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerPincode: string;
};

type CheckoutState = {
  address: DeliveryAddress | null;
  setAddress: (address: DeliveryAddress) => void;
  clear: () => void;
};

export const useCheckout = create<CheckoutState>()(
  persist(
    (set) => ({
      address: null,
      setAddress: (address) => set({ address }),
      clear: () => set({ address: null }),
    }),
    { name: 'nikunj.checkout', storage: createJSONStorage(() => sessionStorage) },
  ),
);
