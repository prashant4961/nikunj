import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { api } from '@/lib/api';
import { formatDate, formatPrice } from '@/lib/format';
import type { Order } from '@/types';

export function Orders() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => (await api.get<{ orders: Order[] }>('/orders')).data.orders,
  });

  if (isLoading) {
    return (
      <div className="container-page space-y-3 py-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you place an order it will show up here with live tracking from packing to delivery."
          actionLabel="Start shopping"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <h1 className="mb-5 font-display text-2xl font-bold text-ink-900">My orders</h1>

      <div className="space-y-3">
        {data.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="card block p-4 transition hover:shadow-lift"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-ink-500">Order #{order.id}</p>
                <p className="text-sm font-semibold text-ink-900">
                  Placed on {formatDate(order.orderDate)}
                </p>
              </div>
              <StatusBadge status={order.orderStatus} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex -space-x-3">
                {order.items.slice(0, 4).map((item) => (
                  <img
                    key={item.id}
                    src={item.productImage}
                    alt=""
                    className="h-14 w-12 rounded-lg border-2 border-white object-cover shadow"
                  />
                ))}
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium text-ink-900">
                  {order.items.map((item) => item.productName).join(', ')}
                </p>
                <p className="text-xs text-ink-500">
                  {order.items.length} item{order.items.length === 1 ? '' : 's'} ·{' '}
                  {order.paymentMethod} · {order.paymentStatus}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-ink-500">Total</p>
                <p className="text-base font-bold text-ink-900">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
