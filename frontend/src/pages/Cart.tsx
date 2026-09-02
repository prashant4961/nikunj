import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/EmptyState';
import { PriceSummary } from '@/components/PriceSummary';
import { discountPercent, formatPrice } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { useCart } from '@/store/cart';
import { toast } from '@/store/toast';

export function Cart() {
  const navigate = useNavigate();
  const token = useAuth((s) => s.token);
  const { lines, setQuantity, remove, itemsTotal, mrpTotal, deliveryFee, grandTotal, count } =
    useCart();

  if (lines.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Browse our bridal sets, jhumkas and temple jewellery — there is something for every occasion."
          actionLabel="Start shopping"
          actionTo="/shop"
        />
      </div>
    );
  }

  const checkout = () => {
    if (!token) {
      toast.info('Please log in to place your order');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container-page py-6">
      <h1 className="mb-5 font-display text-2xl font-bold text-ink-900">
        Your bag <span className="text-base font-medium text-ink-500">({count()} items)</span>
      </h1>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {lines.map((line) => {
            const off = discountPercent(line.price, line.mrp);
            return (
              <div key={line.productId} className="card flex gap-4 p-4">
                <Link
                  to={`/product/${line.slug}`}
                  className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-50"
                >
                  <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    to={`/product/${line.slug}`}
                    className="line-clamp-2 text-sm font-semibold text-ink-900 hover:text-brand-700"
                  >
                    {line.name}
                  </Link>

                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <span className="text-base font-bold">{formatPrice(line.price)}</span>
                    {off > 0 && (
                      <>
                        <span className="text-xs text-ink-300 line-through">
                          {formatPrice(line.mrp)}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">{off}% off</span>
                      </>
                    )}
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                    <div className="flex items-center gap-1 rounded-lg border border-black/10 p-0.5">
                      <button
                        onClick={() => setQuantity(line.productId, line.quantity - 1)}
                        className="grid h-7 w-7 place-items-center rounded-md hover:bg-black/5"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-bold">{line.quantity}</span>
                      <button
                        onClick={() => setQuantity(line.productId, line.quantity + 1)}
                        className="grid h-7 w-7 place-items-center rounded-md hover:bg-black/5"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        remove(line.productId);
                        toast.info('Removed from your bag');
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-ink-500 transition hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-xs text-ink-500">Subtotal</p>
                  <p className="text-base font-bold">{formatPrice(line.price * line.quantity)}</p>
                </div>
              </div>
            );
          })}

          <Link to="/shop" className="btn-outline w-full sm:w-auto">
            Continue shopping
          </Link>
        </div>

        <div className="lg:sticky lg:top-44 lg:self-start">
          <PriceSummary
            itemCount={count()}
            mrpTotal={mrpTotal()}
            itemsTotal={itemsTotal()}
            deliveryFee={deliveryFee()}
            total={grandTotal()}
          >
            <button onClick={checkout} className="btn-primary w-full">
              Place order
            </button>
          </PriceSummary>
        </div>
      </div>
    </div>
  );
}
