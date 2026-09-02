import { ShieldCheck } from 'lucide-react';
import { FREE_DELIVERY_ABOVE } from '@/lib/constants';
import { formatPrice } from '@/lib/format';

export function PriceSummary({
  itemCount,
  mrpTotal,
  itemsTotal,
  deliveryFee,
  total,
  children,
}: {
  itemCount: number;
  mrpTotal: number;
  itemsTotal: number;
  deliveryFee: number;
  total: number;
  children?: React.ReactNode;
}) {
  const savings = mrpTotal - itemsTotal + (deliveryFee === 0 ? 49 : 0);

  return (
    <div className="card overflow-hidden">
      <h2 className="border-b border-black/5 px-5 py-4 text-xs font-bold uppercase tracking-wider text-ink-500">
        Price details
      </h2>

      <dl className="space-y-3 px-5 py-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-700">Price ({itemCount} item{itemCount === 1 ? '' : 's'})</dt>
          <dd className="font-medium">{formatPrice(mrpTotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-700">Discount</dt>
          <dd className="font-medium text-emerald-600">− {formatPrice(mrpTotal - itemsTotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-700">Delivery</dt>
          <dd className="font-medium">
            {deliveryFee === 0 ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              formatPrice(deliveryFee)
            )}
          </dd>
        </div>

        <div className="my-1 border-t border-dashed border-black/10" />

        <div className="flex justify-between text-base font-bold">
          <dt>Total payable</dt>
          <dd>{formatPrice(total)}</dd>
        </div>

        {savings > 0 && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            You save {formatPrice(mrpTotal - itemsTotal)} on this order
          </p>
        )}

        {deliveryFee > 0 && (
          <p className="text-xs text-ink-500">
            Add {formatPrice(FREE_DELIVERY_ABOVE - itemsTotal)} more for free delivery.
          </p>
        )}
      </dl>

      {children && <div className="border-t border-black/5 p-5 pt-4">{children}</div>}

      <p className="flex items-center gap-2 border-t border-black/5 bg-brand-50/60 px-5 py-3 text-xs text-ink-500">
        <ShieldCheck className="h-4 w-4 shrink-0 text-brand-600" />
        Safe and secure payments. Easy returns within 7 days.
      </p>
    </div>
  );
}
