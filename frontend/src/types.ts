export type Role = 'CUSTOMER' | 'ADMIN';

export type User = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  gallery: string[];
  stock: number;
  rating: number;
  ratingCount: number;
  featured: boolean;
  createdAt: string;
};

export type OrderStatus =
  | 'PENDING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type OrderItem = {
  id: number;
  productId: number | null;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerPincode: string;
  itemsTotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: OrderStatus;
  orderDate: string;
  items: OrderItem[];
  user?: { id: number; fullName: string; email: string };
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export type Category = { name: string; count: number };

export type AdminStats = {
  products: number;
  orders: number;
  customers: number;
  revenue: number;
  outOfStock: number;
  recentOrders: Order[];
  byStatus: { status: OrderStatus; count: number }[];
};
