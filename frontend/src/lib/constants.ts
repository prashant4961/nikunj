import type { OrderStatus } from '@/types';

export const FREE_DELIVERY_ABOVE = 999;
export const DELIVERY_FEE = 49;

export const ORDER_FLOW: OrderStatus[] = [
  'PENDING',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Order Placed',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const STATUS_TONE: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  PACKED: 'bg-sky-100 text-sky-800',
  SHIPPED: 'bg-violet-100 text-violet-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-rose-100 text-rose-700',
};

export const STORE = {
  name: 'Nikunj Creation',
  tagline: 'Handcrafted traditional jewellery',
  phone: '+91 80554 748**',
  email: 'nikunjcreation@gmail.com',
  address: 'Gangakhed, Maharashtra, India',
  upiId: 'nikunjcreation@oksbi',
};
