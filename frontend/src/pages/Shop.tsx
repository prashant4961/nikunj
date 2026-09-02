import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { PackageSearch, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/EmptyState';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import type { Category, Paginated, Product } from '@/types';

const sortOptions = [
  { value: 'popular', label: 'Popularity' },
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'discount', label: 'Biggest savings' },
];

const priceBuckets = [
  { label: 'Under ₹1,000', min: 0, max: 999 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹3,500', min: 2000, max: 3500 },
  { label: 'Above ₹3,500', min: 3500, max: undefined },
];

export function Shop() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get('category') ?? '';
  const q = params.get('q') ?? '';
  const sort = params.get('sort') ?? 'popular';
  const minPrice = params.get('minPrice') ?? '';
  const maxPrice = params.get('maxPrice') ?? '';
  const minRating = params.get('minRating') ?? '';
  const inStock = params.get('inStock') === 'true';
  const page = Number(params.get('page') ?? 1);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get<Category[]>('/products/categories')).data,
    staleTime: 5 * 60 * 1000,
  });

  const products = useQuery({
    queryKey: ['products', { category, q, sort, minPrice, maxPrice, minRating, inStock, page }],
    queryFn: async () =>
      (
        await api.get<Paginated<Product>>('/products', {
          params: {
            ...(category ? { category } : {}),
            ...(q ? { q } : {}),
            ...(minPrice ? { minPrice } : {}),
            ...(maxPrice ? { maxPrice } : {}),
            ...(minRating ? { minRating } : {}),
            ...(inStock ? { inStock: 'true' } : {}),
            sort,
            page,
            perPage: 12,
          },
        })
      ).data,
  });

  const activeFilters = [
    category && { key: 'category', label: category },
    q && { key: 'q', label: `“${q}”` },
    minPrice && { key: 'minPrice', label: `Above ${formatPrice(Number(minPrice))}` },
    maxPrice && { key: 'maxPrice', label: `Under ${formatPrice(Number(maxPrice))}` },
    minRating && { key: 'minRating', label: `${minRating}★ & above` },
    inStock && { key: 'inStock', label: 'In stock only' },
  ].filter(Boolean) as { key: string; label: string }[];

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="label">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => setParam('category', null)}
            className={clsx(
              'block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition',
              !category ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-black/5',
            )}
          >
            All jewellery
          </button>
          {(categories.data ?? []).map((c) => (
            <button
              key={c.name}
              onClick={() => setParam('category', c.name)}
              className={clsx(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition',
                category === c.name ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-black/5',
              )}
            >
              {c.name}
              <span className="text-xs text-ink-300">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="label">Price</h3>
        <div className="space-y-1">
          {priceBuckets.map((bucket) => {
            const active =
              minPrice === String(bucket.min) && maxPrice === String(bucket.max ?? '');
            return (
              <button
                key={bucket.label}
                onClick={() => {
                  const next = new URLSearchParams(params);
                  if (active) {
                    next.delete('minPrice');
                    next.delete('maxPrice');
                  } else {
                    next.set('minPrice', String(bucket.min));
                    if (bucket.max) next.set('maxPrice', String(bucket.max));
                    else next.delete('maxPrice');
                  }
                  next.delete('page');
                  setParams(next);
                }}
                className={clsx(
                  'block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition',
                  active ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-black/5',
                )}
              >
                {bucket.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="label">Customer rating</h3>
        <div className="space-y-1">
          {['4.5', '4', '3.5'].map((value) => (
            <button
              key={value}
              onClick={() => setParam('minRating', minRating === value ? null : value)}
              className={clsx(
                'block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition',
                minRating === value ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-black/5',
              )}
            >
              {value}★ &amp; above
            </button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 px-1 text-sm font-medium text-ink-700">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(event) => setParam('inStock', event.target.checked ? 'true' : null)}
          className="h-4 w-4 rounded border-black/20 text-brand-700 focus:ring-brand-400"
        />
        In stock only
      </label>
    </div>
  );

  return (
    <div className="container-page py-6">
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-44 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Filters</h2>
              {activeFilters.length > 0 && (
                <button
                  onClick={() => setParams(new URLSearchParams())}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            {filterPanel}
          </div>
        </aside>

        <section>
          <div className="card mb-4 flex flex-wrap items-center gap-3 p-4">
            <div className="mr-auto">
              <h1 className="font-display text-xl font-bold text-ink-900">
                {category || (q ? `Results for “${q}”` : 'All Jewellery')}
              </h1>
              <p className="text-xs text-ink-500">
                {products.data ? `${products.data.total} products found` : 'Loading products…'}
              </p>
            </div>

            <button
              onClick={() => setFiltersOpen(true)}
              className="btn-outline px-4 py-2 text-xs lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>

            <label className="flex items-center gap-2 text-xs font-semibold text-ink-500">
              Sort by
              <select
                value={sort}
                onChange={(event) => setParam('sort', event.target.value)}
                className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none focus:border-brand-400"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {activeFilters.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setParam(filter.key, null)}
                  className="chip bg-white text-ink-700 shadow-card"
                >
                  {filter.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {products.isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.data && products.data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {products.data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.data.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {Array.from({ length: products.data.totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setParam('page', String(i + 1))}
                      className={clsx(
                        'h-9 w-9 rounded-lg text-sm font-semibold transition',
                        page === i + 1
                          ? 'bg-brand-700 text-white'
                          : 'bg-white text-ink-700 shadow-card hover:bg-brand-50',
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="No jewellery matches these filters"
              description="Try removing a filter or searching for something else — new designs are added every week."
              actionLabel="Clear filters"
              actionTo="/shop"
            />
          )}
        </section>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5 text-ink-500" />
              </button>
            </div>
            {filterPanel}
            <button onClick={() => setFiltersOpen(false)} className="btn-primary mt-6 w-full">
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
