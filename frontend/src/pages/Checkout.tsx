import { CheckCircle2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PriceSummary } from '@/components/PriceSummary';
import { formatPrice } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { useCart } from '@/store/cart';
import { useCheckout, type DeliveryAddress } from '@/store/checkout';

type Errors = Partial<Record<keyof DeliveryAddress, string>>;

function validate(form: DeliveryAddress): Errors {
  const errors: Errors = {};
  if (form.customerName.trim().length < 3) errors.customerName = 'Please enter the full name';
  if (!/^[6-9]\d{9}$/.test(form.customerPhone)) errors.customerPhone = 'Enter a valid 10 digit mobile number';
  if (form.customerAddress.trim().length < 10) errors.customerAddress = 'Please enter the complete address';
  if (form.customerCity.trim().length < 2) errors.customerCity = 'Please enter your city';
  if (!/^\d{6}$/.test(form.customerPincode)) errors.customerPincode = 'Enter a valid 6 digit pincode';
  return errors;
}

export function Checkout() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const { lines, itemsTotal, mrpTotal, deliveryFee, grandTotal, count } = useCart();
  const { address, setAddress } = useCheckout();

  const [form, setForm] = useState<DeliveryAddress>(
    address ?? {
      customerName: user?.fullName ?? '',
      customerPhone: user?.phone ?? '',
      customerAddress: '',
      customerCity: '',
      customerPincode: '',
    },
  );
  const [errors, setErrors] = useState<Errors>({});

  if (lines.length === 0) return <Navigate to="/cart" replace />;

  const update = (key: keyof DeliveryAddress) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setAddress(form);
    navigate('/payment');
  };

  const steps = ['Bag', 'Delivery address', 'Payment'];

  return (
    <div className="container-page py-6">
      <ol className="mb-6 flex items-center gap-3 text-xs font-semibold">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-3">
            <span
              className={
                index <= 1
                  ? 'flex items-center gap-1.5 rounded-full bg-brand-700 px-3 py-1.5 text-white'
                  : 'flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-ink-500 shadow-card'
              }
            >
              {index === 0 && <CheckCircle2 className="h-3.5 w-3.5" />}
              {step}
            </span>
            {index < steps.length - 1 && <span className="h-px w-6 bg-black/10" />}
          </li>
        ))}
      </ol>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="card space-y-5 p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <h1 className="font-display text-xl font-bold text-ink-900">Delivery address</h1>
              <p className="text-xs text-ink-500">Where should we send your jewellery?</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="customerName">
                Full name
              </label>
              <input
                id="customerName"
                className="field"
                value={form.customerName}
                onChange={update('customerName')}
                placeholder="Priya Sharma"
              />
              {errors.customerName && <p className="mt-1 text-xs text-rose-600">{errors.customerName}</p>}
            </div>

            <div>
              <label className="label" htmlFor="customerPhone">
                Mobile number
              </label>
              <input
                id="customerPhone"
                className="field"
                inputMode="numeric"
                maxLength={10}
                value={form.customerPhone}
                onChange={update('customerPhone')}
                placeholder="9876543210"
              />
              {errors.customerPhone && <p className="mt-1 text-xs text-rose-600">{errors.customerPhone}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="label" htmlFor="customerAddress">
                Full address
              </label>
              <textarea
                id="customerAddress"
                rows={3}
                className="field resize-none"
                value={form.customerAddress}
                onChange={update('customerAddress')}
                placeholder="House / flat no., street, area, landmark"
              />
              {errors.customerAddress && (
                <p className="mt-1 text-xs text-rose-600">{errors.customerAddress}</p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="customerCity">
                City
              </label>
              <input
                id="customerCity"
                className="field"
                value={form.customerCity}
                onChange={update('customerCity')}
                placeholder="Gangakhed"
              />
              {errors.customerCity && <p className="mt-1 text-xs text-rose-600">{errors.customerCity}</p>}
            </div>

            <div>
              <label className="label" htmlFor="customerPincode">
                Pincode
              </label>
              <input
                id="customerPincode"
                className="field"
                inputMode="numeric"
                maxLength={6}
                value={form.customerPincode}
                onChange={update('customerPincode')}
                placeholder="431514"
              />
              {errors.customerPincode && (
                <p className="mt-1 text-xs text-rose-600">{errors.customerPincode}</p>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full sm:w-auto">
            Continue to payment
          </button>
        </form>

        <div className="space-y-4 lg:sticky lg:top-44 lg:self-start">
          <div className="card p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">
              Order summary
            </h2>
            <ul className="space-y-3">
              {lines.map((line) => (
                <li key={line.productId} className="flex gap-3">
                  <img
                    src={line.image}
                    alt=""
                    className="h-14 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-semibold text-ink-900">{line.name}</p>
                    <p className="text-xs text-ink-500">Qty {line.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <PriceSummary
            itemCount={count()}
            mrpTotal={mrpTotal()}
            itemsTotal={itemsTotal()}
            deliveryFee={deliveryFee()}
            total={grandTotal()}
          />
        </div>
      </div>
    </div>
  );
}
