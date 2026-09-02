import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { BadgeIndianRupee, Loader2, Lock, QrCode, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PriceSummary } from '@/components/PriceSummary';
import { api, apiErrorMessage } from '@/lib/api';
import { STORE } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/store/cart';
import { useCheckout } from '@/store/checkout';
import { toast } from '@/store/toast';
import type { Order } from '@/types';

type Method = 'UPI' | 'COD';

export function Payment() {
  const navigate = useNavigate();
  const { lines, itemsTotal, mrpTotal, deliveryFee, grandTotal, count, clear } = useCart();
  const { address, clear: clearAddress } = useCheckout();
  const [method, setMethod] = useState<Method>('UPI');

  const placeOrder = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ order: Order }>('/orders', {
        ...address,
        paymentMethod: method,
        items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
      });
      return data.order;
    },
    onSuccess: (order) => {
      clear();
      clearAddress();
      navigate(`/order-success/${order.id}`, { replace: true });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'We could not place your order')),
  });

  if (lines.length === 0) return <Navigate to="/cart" replace />;
  if (!address) return <Navigate to="/checkout" replace />;

  const total = grandTotal();
  const upiLink = `upi://pay?pa=${STORE.upiId}&pn=${encodeURIComponent(STORE.name)}&am=${total}&cu=INR`;

  return (
    <div className="container-page py-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Lock className="h-4 w-4" />
              </span>
              <div>
                <h1 className="font-display text-xl font-bold text-ink-900">Payment</h1>
                <p className="text-xs text-ink-500">
                  Delivering to {address.customerName}, {address.customerCity} —{' '}
                  {address.customerPincode}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {(
                [
                  { value: 'UPI', title: 'UPI / QR', copy: 'GPay, PhonePe, Paytm', icon: Smartphone },
                  { value: 'COD', title: 'Cash on delivery', copy: 'Pay when it arrives', icon: BadgeIndianRupee },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMethod(option.value)}
                  className={clsx(
                    'flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition',
                    method === option.value
                      ? 'border-brand-600 bg-brand-50/60'
                      : 'border-black/10 hover:border-brand-300',
                  )}
                >
                  <option.icon className="mt-0.5 h-5 w-5 text-brand-700" />
                  <span>
                    <span className="block text-sm font-semibold text-ink-900">{option.title}</span>
                    <span className="block text-xs text-ink-500">{option.copy}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {method === 'UPI' ? (
            <div className="card flex flex-col items-center gap-4 p-8 text-center">
              <span className="chip bg-brand-50 text-brand-700">
                <QrCode className="h-3.5 w-3.5" /> Scan &amp; pay
              </span>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <QRCodeSVG value={upiLink} size={196} fgColor="#3f0f1f" level="M" />
              </div>

              <div>
                <p className="text-xs text-ink-500">Paying to</p>
                <p className="font-semibold text-ink-900">{STORE.upiId}</p>
              </div>

              <p className="text-2xl font-bold text-ink-900">{formatPrice(total)}</p>

              <p className="max-w-sm text-xs text-ink-500">
                Scan the code with any UPI app, complete the payment, then confirm below. Your order
                is created only after you confirm.
              </p>
            </div>
          ) : (
            <div className="card space-y-2 p-8 text-center">
              <h2 className="font-display text-xl font-bold">Pay {formatPrice(total)} on delivery</h2>
              <p className="mx-auto max-w-sm text-sm text-ink-500">
                Keep the exact amount ready. Our delivery partner accepts cash and UPI at the door.
              </p>
            </div>
          )}

          <button
            onClick={() => placeOrder.mutate()}
            disabled={placeOrder.isPending}
            className="btn-primary w-full py-4 text-base"
          >
            {placeOrder.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {method === 'UPI' ? 'I have paid — place my order' : 'Confirm order'}
          </button>
        </div>

        <div className="lg:sticky lg:top-44 lg:self-start">
          <PriceSummary
            itemCount={count()}
            mrpTotal={mrpTotal()}
            itemsTotal={itemsTotal()}
            deliveryFee={deliveryFee()}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
