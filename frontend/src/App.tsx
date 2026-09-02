import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StoreLayout } from '@/components/StoreLayout';
import { Toaster } from '@/components/Toaster';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { Home } from '@/pages/Home';
import { Login, Register } from '@/pages/Login';
import { OrderSuccess } from '@/pages/OrderSuccess';
import { Orders } from '@/pages/Orders';
import { Payment } from '@/pages/Payment';
import { ProductDetail } from '@/pages/ProductDetail';
import { Profile } from '@/pages/Profile';
import { Shop } from '@/pages/Shop';
import { About, Contact, NotFound } from '@/pages/Static';
import { TrackOrder } from '@/pages/TrackOrder';
import { Wishlist } from '@/pages/Wishlist';
import { AdminCustomers } from '@/pages/admin/AdminCustomers';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminOrders } from '@/pages/admin/AdminOrders';
import { AdminProducts } from '@/pages/admin/AdminProducts';
import { useAuth } from '@/store/auth';

export default function App() {
  const refresh = useAuth((s) => s.refresh);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<TrackOrder />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Route>
        </Route>
      </Routes>

      <Toaster />
    </>
  );
}
