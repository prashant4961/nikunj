import clsx from 'clsx';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Rating } from '@/components/Rating';
import { discountPercent, formatPrice } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { useCart } from '@/store/cart';
import { toast } from '@/store/toast';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const addToCart = useCart((s) => s.add);
  const token = useAuth((s) => s.token);
  const wishlist = useWishlist();

  const off = discountPercent(product.price, product.mrp);
  const outOfStock = product.stock <= 0;
  const saved = wishlist.isSaved(product.id);

  const onWishlist = () => {
    if (!token) {
      toast.info('Log in to save items to your wishlist');
      navigate('/login');
      return;
    }
    wishlist.toggle(product);
  };

  return (
    <div className="group card flex flex-col overflow-hidden transition duration-200 hover:shadow-lift">
      <div className="relative">
        <Link to={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-brand-50">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={clsx(
              'h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]',
              outOfStock && 'opacity-60 grayscale',
            )}
          />
        </Link>

        {off > 0 && (
          <span className="chip absolute left-3 top-3 bg-brand-700 text-white shadow">{off}% OFF</span>
        )}

        {outOfStock && (
          <span className="chip absolute bottom-3 left-3 bg-ink-900/85 text-white">Out of stock</span>
        )}

        <button
          onClick={onWishlist}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow transition hover:scale-105"
        >
          <Heart
            className={clsx('h-4 w-4 transition', saved ? 'text-brand-600' : 'text-ink-300')}
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
          {product.category}
        </p>

        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900 hover:text-brand-700"
        >
          {product.name}
        </Link>

        <Rating value={product.rating} count={product.ratingCount} />

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-lg font-bold text-ink-900">{formatPrice(product.price)}</span>
          {off > 0 && (
            <span className="text-sm text-ink-300 line-through">{formatPrice(product.mrp)}</span>
          )}
        </div>

        <button
          disabled={outOfStock}
          onClick={() => {
            addToCart(product);
            toast.success('Added to your bag');
          }}
          className="btn-gold mt-1 w-full py-2.5 text-[13px]"
        >
          <ShoppingCart className="h-4 w-4" />
          {outOfStock ? 'Notify me' : 'Add to bag'}
        </button>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/5]" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}
