import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  Heart,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { Rating } from '@/components/Rating';
import { useWishlist } from '@/hooks/useWishlist';
import { api } from '@/lib/api';
import { FREE_DELIVERY_ABOVE, STORE } from '@/lib/constants';
import { discountPercent, formatPrice } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { useCart } from '@/store/cart';
import { toast } from '@/store/toast';
import type { Product } from '@/types';

const highlights = [
  { icon: ShieldCheck, label: '1 year plating warranty' },
  { icon: RefreshCw, label: '7 day easy returns' },
  { icon: Truck, label: `Free delivery above ${formatPrice(FREE_DELIVERY_ABOVE)}` },
  { icon: Sparkles, label: 'Hand-finished by our karigars' },
];

export function ProductDetail() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const addToCart = useCart((s) => s.add);
  const token = useAuth((s) => s.token);
  const wishlist = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () =>
      (await api.get<{ product: Product; related: Product[] }>(`/products/${slug}`)).data,
  });

  useEffect(() => {
    setQuantity(1);
    setActiveImage(0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container-page grid gap-8 py-8 lg:grid-cols-2">
        <div className="skeleton aspect-square rounded-3xl" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-5 w-1/3 rounded" />
          <div className="skeleton h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-bold">We could not find this piece</h1>
        <Link to="/shop" className="btn-primary mt-6">
          Back to shop
        </Link>
      </div>
    );
  }

  const { product, related } = data;
  const gallery = product.gallery.length ? product.gallery : [product.image];
  const off = discountPercent(product.price, product.mrp);
  const outOfStock = product.stock <= 0;
  const saved = wishlist.isSaved(product.id);

  const buyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container-page space-y-12 py-6">
      <nav className="text-xs text-ink-500">
        <Link to="/" className="hover:text-brand-700">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-700">
          {product.category}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="lg:sticky lg:top-44 lg:self-start">
          <div className="card overflow-hidden">
            <div className="relative aspect-square bg-brand-50">
              <img
                src={gallery[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {off > 0 && (
                <span className="chip absolute left-4 top-4 bg-brand-700 text-white">{off}% OFF</span>
              )}
              <button
                onClick={() => {
                  if (!token) {
                    toast.info('Log in to save items to your wishlist');
                    navigate('/login');
                    return;
                  }
                  wishlist.toggle(product);
                }}
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white shadow-card transition hover:scale-105"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={clsx('h-5 w-5', saved ? 'text-brand-600' : 'text-ink-300')}
                  fill={saved ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-2 p-3">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setActiveImage(index)}
                    className={clsx(
                      'h-16 w-16 overflow-hidden rounded-xl border-2 transition',
                      index === activeImage ? 'border-brand-600' : 'border-transparent opacity-70',
                    )}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              disabled={outOfStock}
              onClick={() => {
                addToCart(product, quantity);
                toast.success('Added to your bag');
              }}
              className="btn-gold py-3.5"
            >
              <ShoppingBag className="h-4 w-4" /> Add to bag
            </button>
            <button disabled={outOfStock} onClick={buyNow} className="btn-primary py-3.5">
              <Zap className="h-4 w-4" /> Buy now
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">
              {product.category}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold leading-tight text-ink-900 sm:text-3xl">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <Rating value={product.rating} count={product.ratingCount} size="md" />
              <span className="text-xs font-medium text-ink-500">
                {product.ratingCount.toLocaleString('en-IN')} ratings
              </span>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-ink-900">{formatPrice(product.price)}</span>
              {off > 0 && (
                <>
                  <span className="text-lg text-ink-300 line-through">{formatPrice(product.mrp)}</span>
                  <span className="text-lg font-bold text-emerald-600">{off}% off</span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-ink-500">Inclusive of all taxes</p>

            <div className="mt-4 flex items-center gap-4">
              <span className="label mb-0">Quantity</span>
              <div className="flex items-center gap-1 rounded-xl border border-black/10 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-700 hover:bg-black/5"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(Math.max(product.stock, 1), q + 1))}
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-700 hover:bg-black/5"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {outOfStock ? (
                <span className="chip bg-rose-100 text-rose-700">Out of stock</span>
              ) : product.stock <= 5 ? (
                <span className="chip bg-amber-100 text-amber-800">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="chip bg-emerald-100 text-emerald-700">In stock</span>
              )}
            </div>
          </div>

          <div className="card space-y-3 p-5">
            <h2 className="font-display text-lg font-bold">Delivery</h2>
            <div className="flex items-start gap-2.5 text-sm text-ink-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              <p>
                Ships from {STORE.address}. Delivered in 3–6 days across India, tracked at every step
                from your orders page.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 rounded-xl bg-brand-50/70 px-3 py-2.5">
                  <item.icon className="h-4 w-4 shrink-0 text-brand-700" />
                  <span className="text-xs font-medium text-ink-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-display text-lg font-bold">About this piece</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{product.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
              {[
                ['Collection', product.category],
                ['Finish', 'Gold plated brass'],
                ['Stones', 'Kundan / AD'],
                ['Care', 'Keep away from perfume'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-ink-500">{label}</dt>
                  <dd className="font-medium text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-5 font-display text-2xl font-bold text-ink-900">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
