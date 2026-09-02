import { Heart } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { useWishlist } from '@/hooks/useWishlist';

export function Wishlist() {
  const { items, isLoading } = useWishlist();

  return (
    <div className="container-page py-6">
      <h1 className="mb-5 font-display text-2xl font-bold text-ink-900">
        My wishlist{' '}
        {items.length > 0 && (
          <span className="text-base font-medium text-ink-500">({items.length} pieces)</span>
        )}
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          description="Tap the heart on any piece to keep it here while you decide."
          actionLabel="Browse jewellery"
          actionTo="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
