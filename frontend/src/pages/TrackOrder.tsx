import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Check, MapPin, Package, Truck, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { api, apiErrorMessage } from '@/lib/api';
import { ORDER_FLOW, STATUS_LABEL } from '@/lib/constants';
import { deliveryEstimate, formatDateTime, formatPrice } from '@/lib/format';
import { toast } from '@/store/toast';
import type { Order } from '@/types';

export function TrackOrder() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => (await api.get<{ order: Order }>(`/orders/${id}`)).data.order,
  });

  const cancel = useMutation({
    mutationFn: async () => api.post(`/orders/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Your order has been cancelled');
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not cancel this order')),
  });

  if (isLoading) return <div className="container-page py-10"><div className="skeleton h-72 rounded-3xl" /></div>;
  if (!order) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Order not found</h1>
        <Link to="/orders" className="btn-primary mt-6">
          Back to my orders
        </Link>
      </div>
    );
  }

  const cancelled = order.orderStatus === 'CANCELLED';
  const currentStep = ORDER_FLOW.indexOf(order.orderStatus);
  const canCancel = order.orderStatus === 'PENDING' || order.orderStatus === 'PACKED';

  return (
    <div className="container-page space-y-5 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-ink-500">Order #{order.id}</p>
          <h1 className="font-display text-2xl font-bold text-ink-900">Track your order</h1>
        </div>
        <StatusBadge status={order.orderStatus} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="card p-6">
            {cancelled ? (
              <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4 text-rose-700">
                <XCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">
                  This order was cancelled. Any amount paid is refunded within 5 working days.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-6 text-sm font-medium text-ink-700">
                  {order.orderStatus === 'DELIVERED'
                    ? 'Delivered — we hope you love it.'
                    : `Arriving by ${deliveryEstimate(order.orderDate)}`}
                </p>

                <ol className="relative space-y-8 pl-2">
                  <span className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-0.5 bg-black/10" />
                  <span
                    className="absolute left-[15px] top-2 w-0.5 bg-brand-600 transition-all duration-500"
                    style={{
                      height: `${(Math.max(currentStep, 0) / (ORDER_FLOW.length - 1)) * 100}%`,
                    }}
                  />
                  {ORDER_FLOW.map((step, index) => {
                    const done = index <= currentStep;
                    return (
                      <li key={step} className="relative flex items-start gap-4">
                        <span
                          className={clsx(
                            'z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition',
                            done
                              ? 'border-brand-600 bg-brand-600 text-white'
                              : 'border-black/10 bg-white text-ink-300',
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </span>
                        <div className="pt-1">
                          <p
                            className={clsx(
                              'text-sm font-semibold',
                              done ? 'text-ink-900' : 'text-ink-300',
                            )}
                          >
                            {STATUS_LABEL[step]}
                          </p>
                          <p className="text-xs text-ink-500">
                            {index === 0
                              ? formatDateTime(order.orderDate)
                              : done
                                ? 'Completed'
                                : 'Pending'}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </>
            )}
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-display text-lg font-bold">Items in this order</h2>
            <ul className="space-y-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.productImage}
                    alt=""
                    className="h-20 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-900">{item.productName}</p>
                    <p className="text-xs text-ink-500">
                      Qty {item.quantity} · {formatPrice(item.price)} each
                    </p>
                  </div>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-500">
              <MapPin className="h-3.5 w-3.5" /> Delivery address
            </h2>
            <p className="text-sm font-semibold text-ink-900">{order.customerName}</p>
            <p className="mt-1 text-sm text-ink-700">{order.customerAddress}</p>
            <p className="text-sm text-ink-700">
              {order.customerCity} — {order.customerPincode}
            </p>
            <p className="mt-2 text-sm text-ink-500">📞 {order.customerPhone}</p>
          </div>

          <div className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-500">
              <Package className="h-3.5 w-3.5" /> Payment
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-700">Items</dt>
                <dd>{formatPrice(order.itemsTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-700">Delivery</dt>
                <dd>{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-dashed border-black/10 pt-2 font-bold">
                <dt>Total</dt>
                <dd>{formatPrice(order.totalAmount)}</dd>
              </div>
              <p className="pt-1 text-xs text-ink-500">
                {order.paymentMethod} · {order.paymentStatus}
              </p>
            </dl>
          </div>

          {canCancel && (
            <button
              onClick={() => cancel.mutate()}
              disabled={cancel.isPending}
              className="btn-outline w-full border-rose-200 text-rose-600 hover:border-rose-400 hover:bg-rose-50"
            >
              <XCircle className="h-4 w-4" /> Cancel this order
            </button>
          )}

          <Link to="/orders" className="btn-ghost w-full">
            <Truck className="h-4 w-4" /> All my orders
          </Link>
        </div>
      </div>
    </div>
  );
}
