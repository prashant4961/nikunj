import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, PackageCheck, Truck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { deliveryEstimate, formatPrice } from '@/lib/format';
import type { Order } from '@/types';

export function OrderSuccess() {
  const { id = '' } = useParams();

  const { data } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => (await api.get<{ order: Order }>(`/orders/${id}`)).data.order,
  });

  return (
    <div className="container-page max-w-2xl py-12">
      <div className="card overflow-hidden text-center">
        <div className="bg-gradient-to-r from-brand-800 to-brand-600 px-6 py-10 text-white">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/15">
            <CheckCircle2 className="h-9 w-9" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Order confirmed</h1>
          <p className="mt-1 text-sm text-white/80">
            Thank you! We have started packing your jewellery.
          </p>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-brand-50/70 p-4">
              <p className="text-xs text-ink-500">Order ID</p>
              <p className="font-bold text-ink-900">#{id}</p>
            </div>
            <div className="rounded-2xl bg-brand-50/70 p-4">
              <p className="text-xs text-ink-500">Amount</p>
              <p className="font-bold text-ink-900">
                {data ? formatPrice(data.totalAmount) : '—'}
              </p>
            </div>
            <div className="rounded-2xl bg-brand-50/70 p-4">
              <p className="text-xs text-ink-500">Arriving by</p>
              <p className="font-bold text-ink-900">
                {data ? deliveryEstimate(data.orderDate) : '—'}
              </p>
            </div>
          </div>

          {data && (
            <ul className="space-y-3 text-left">
              {data.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt=""
                    className="h-14 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold">{item.productName}</p>
                    <p className="text-xs text-ink-500">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to={`/orders/${id}`} className="btn-primary flex-1">
              <Truck className="h-4 w-4" /> Track this order
            </Link>
            <Link to="/shop" className="btn-outline flex-1">
              <PackageCheck className="h-4 w-4" /> Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
