import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, IndianRupee, Package, ShoppingCart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { api } from '@/lib/api';
import { STATUS_LABEL } from '@/lib/constants';
import { formatDate, formatPrice } from '@/lib/format';
import type { AdminStats } from '@/types';

export function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => (await api.get<AdminStats>('/admin/stats')).data,
  });

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Revenue', value: formatPrice(data.revenue), icon: IndianRupee, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Orders', value: data.orders, icon: ShoppingCart, tone: 'bg-sky-50 text-sky-700' },
    { label: 'Products', value: data.products, icon: Package, tone: 'bg-brand-50 text-brand-700' },
    { label: 'Customers', value: data.customers, icon: Users, tone: 'bg-amber-50 text-amber-700' },
  ];

  const maxCount = Math.max(1, ...data.byStatus.map((s) => s.count));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-500">How the store is doing right now.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card flex items-center gap-4 p-5">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${card.tone}`}>
              <card.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                {card.label}
              </p>
              <p className="truncate font-display text-2xl font-bold text-ink-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {data.outOfStock > 0 && (
        <Link
          to="/admin/products"
          className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
        >
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {data.outOfStock} product{data.outOfStock === 1 ? ' is' : 's are'} out of stock — restock
          them to keep selling.
        </Link>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <h2 className="font-display text-lg font-bold">Recent orders</h2>
            <Link to="/admin/orders" className="text-sm font-semibold text-brand-700 hover:underline">
              View all
            </Link>
          </div>

          <div className="divide-y divide-black/5">
            {data.recentOrders.map((order) => (
              <Link
                key={order.id}
                to="/admin/orders"
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-brand-50/50"
              >
                <img
                  src={order.items[0]?.productImage}
                  alt=""
                  className="h-12 w-10 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-900">
                    #{order.id} · {order.customerName}
                  </p>
                  <p className="truncate text-xs text-ink-500">
                    {order.items.length} item{order.items.length === 1 ? '' : 's'} ·{' '}
                    {formatDate(order.orderDate)}
                  </p>
                </div>
                <StatusBadge status={order.orderStatus} />
                <span className="w-20 text-right text-sm font-bold">
                  {formatPrice(order.totalAmount)}
                </span>
              </Link>
            ))}
            {data.recentOrders.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-ink-500">No orders yet.</p>
            )}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-display text-lg font-bold">Orders by status</h2>
          <ul className="space-y-3">
            {data.byStatus.map((row) => (
              <li key={row.status}>
                <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                  <span className="text-ink-700">{STATUS_LABEL[row.status]}</span>
                  <span className="text-ink-500">{row.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${(row.count / maxCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
            {data.byStatus.length === 0 && (
              <p className="text-sm text-ink-500">Nothing to show yet.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
