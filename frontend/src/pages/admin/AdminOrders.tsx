import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { api, apiErrorMessage } from '@/lib/api';
import { ORDER_FLOW, STATUS_LABEL } from '@/lib/constants';
import { formatDateTime, formatPrice } from '@/lib/format';
import { toast } from '@/store/toast';
import type { Order, OrderStatus } from '@/types';

const filters: (OrderStatus | 'ALL')[] = ['ALL', ...ORDER_FLOW, 'CANCELLED'];

export function AdminOrders() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', status],
    queryFn: async () =>
      (await api.get<{ orders: Order[] }>('/admin/orders', { params: { status } })).data.orders,
  });

  const update = useMutation({
    mutationFn: async ({ id, next }: { id: number; next: OrderStatus }) =>
      api.put(`/admin/orders/${id}/status`, { status: next }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      toast.success(`Order #${variables.id} marked as ${STATUS_LABEL[variables.next]}`);
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update this order')),
  });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink-900">Orders</h1>
        <p className="text-sm text-ink-500">Move each order along as you pack and ship it.</p>
      </header>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setStatus(filter)}
            className={clsx(
              'chip shrink-0 px-4 py-2',
              status === filter ? 'bg-brand-700 text-white' : 'bg-white text-ink-700 shadow-card',
            )}
          >
            {filter === 'ALL' ? 'All orders' : STATUS_LABEL[filter]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}

        {(data ?? []).map((order) => {
          const open = expanded === order.id;
          const currentIndex = ORDER_FLOW.indexOf(order.orderStatus);
          const nextStatus = ORDER_FLOW[currentIndex + 1];

          return (
            <div key={order.id} className="card overflow-hidden">
              <button
                onClick={() => setExpanded(open ? null : order.id)}
                className="flex w-full flex-wrap items-center gap-4 p-4 text-left transition hover:bg-brand-50/40"
              >
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item) => (
                    <img
                      key={item.id}
                      src={item.productImage}
                      alt=""
                      className="h-12 w-10 rounded-lg border-2 border-white object-cover"
                    />
                  ))}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink-900">
                    #{order.id} · {order.customerName}
                  </p>
                  <p className="truncate text-xs text-ink-500">
                    {formatDateTime(order.orderDate)} · {order.customerCity} —{' '}
                    {order.customerPincode} · {order.paymentMethod}
                  </p>
                </div>

                <StatusBadge status={order.orderStatus} />

                <span className="w-24 text-right text-sm font-bold">
                  {formatPrice(order.totalAmount)}
                </span>

                <ChevronDown
                  className={clsx('h-4 w-4 text-ink-500 transition', open && 'rotate-180')}
                />
              </button>

              {open && (
                <div className="grid gap-5 border-t border-black/5 bg-brand-50/30 p-5 lg:grid-cols-[1fr_300px]">
                  <div>
                    <h3 className="label">Items</h3>
                    <ul className="space-y-3">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt=""
                            className="h-14 w-12 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-ink-900">{item.productName}</p>
                            <p className="text-xs text-ink-500">
                              Qty {item.quantity} · {formatPrice(item.price)}
                            </p>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="label mt-5">Deliver to</h3>
                    <p className="text-sm text-ink-700">
                      {order.customerName}, {order.customerAddress}, {order.customerCity} —{' '}
                      {order.customerPincode}
                    </p>
                    <p className="text-sm text-ink-500">📞 {order.customerPhone}</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="label">Update status</h3>

                    {nextStatus && order.orderStatus !== 'CANCELLED' && (
                      <button
                        onClick={() => update.mutate({ id: order.id, next: nextStatus })}
                        disabled={update.isPending}
                        className="btn-primary w-full"
                      >
                        Mark as {STATUS_LABEL[nextStatus]}
                      </button>
                    )}

                    <select
                      value={order.orderStatus}
                      onChange={(event) =>
                        update.mutate({ id: order.id, next: event.target.value as OrderStatus })
                      }
                      className="field"
                    >
                      {[...ORDER_FLOW, 'CANCELLED' as const].map((option) => (
                        <option key={option} value={option}>
                          {STATUS_LABEL[option]}
                        </option>
                      ))}
                    </select>

                    <dl className="rounded-xl bg-white p-4 text-sm shadow-card">
                      <div className="flex justify-between">
                        <dt className="text-ink-500">Items</dt>
                        <dd>{formatPrice(order.itemsTotal)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-ink-500">Delivery</dt>
                        <dd>{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</dd>
                      </div>
                      <div className="mt-2 flex justify-between border-t border-dashed border-black/10 pt-2 font-bold">
                        <dt>Total</dt>
                        <dd>{formatPrice(order.totalAmount)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {!isLoading && (data ?? []).length === 0 && (
          <p className="card px-5 py-16 text-center text-sm text-ink-500">
            No orders with this status yet.
          </p>
        )}
      </div>
    </div>
  );
}
