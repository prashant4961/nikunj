import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BadgeIndianRupee, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { api } from '@/lib/api';
import type { Category, Paginated, Product } from '@/types';

const usps = [
  { icon: Truck, title: 'Free delivery', copy: 'On every order above ₹999' },
  { icon: ShieldCheck, title: '1 year plating warranty', copy: 'On all gold plated pieces' },
  { icon: RefreshCw, title: '7 day easy returns', copy: 'No questions asked' },
  { icon: BadgeIndianRupee, title: 'Cash on delivery', copy: 'Available across India' },
];

function SectionHeader({
  eyebrow,
  title,
  to,
}: {
  eyebrow: string;
  title: string;
  to: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>
        <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">{title}</h2>
      </div>
      <Link
        to={to}
        className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:gap-2 sm:flex"
      >
        View all <ArrowRight className="h-4 w-4 transition-all" />
      </Link>
    </div>
  );
}

export function Home() {
  const featured = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => (await api.get<{ items: Product[] }>('/products/featured')).data.items,
  });

  const newest = useQuery({
    queryKey: ['products', 'newest'],
    queryFn: async () =>
      (await api.get<Paginated<Product>>('/products', { params: { sort: 'newest', perPage: 8 } }))
        .data.items,
  });

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get<Category[]>('/products/categories')).data,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="container-page space-y-14 py-6">
      <HeroCarousel />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {usps.map((usp) => (
          <div key={usp.title} className="card flex items-center gap-3 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <usp.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-tight text-ink-900">{usp.title}</p>
              <p className="text-[11px] leading-tight text-ink-500 sm:text-xs">{usp.copy}</p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <SectionHeader eyebrow="Browse by" title="Shop our collections" to="/shop" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 lg:grid-cols-6">
          {(categories.data ?? []).map((category, index) => (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="card group flex w-40 shrink-0 flex-col items-center gap-3 p-4 text-center transition hover:shadow-lift sm:w-auto"
            >
              <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-brand-50 ring-2 ring-brand-100">
                <img
                  src={`/images/products/set-${(index % 21) + 1}.jpeg`}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </span>
              <span className="text-sm font-semibold leading-tight text-ink-900">{category.name}</span>
              <span className="text-xs text-ink-500">{category.count} designs</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Handpicked" title="Bestsellers this week" to="/shop?sort=popular" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {featured.isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : (featured.data ?? []).slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-800 to-brand-600">
        <div className="grid items-center gap-6 p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <span className="chip bg-gold-400 text-brand-900">Wedding season</span>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Flat 20% off the entire bridal collection
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/80">
              Rani haars, chokers, vankis and naths — everything a bride needs, delivered in a velvet
              box with a two year plating warranty.
            </p>
            <Link to="/shop?category=Bridal%20Collection" className="btn-gold mt-6">
              Shop the bridal edit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 5, 12].map((n) => (
              <img
                key={n}
                src={`/images/products/set-${n}.jpeg`}
                alt=""
                loading="lazy"
                className="aspect-[3/4] w-full rounded-2xl object-cover shadow-pop"
              />
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Just in" title="New arrivals" to="/shop?sort=newest" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {newest.isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : (newest.data ?? []).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="card grid gap-6 p-8 sm:grid-cols-3 sm:p-10">
        {[
          {
            quote:
              'Ordered a kundan set for my sister’s wedding. The finish is far better than what I expected at this price.',
            name: 'Snehal P.',
            city: 'Pune',
          },
          {
            quote:
              'The kolhapuri saaj is exactly like the one my aai has. Packed very safely and reached in four days.',
            name: 'Vaishnavi K.',
            city: 'Nanded',
          },
          {
            quote:
              'Bought jhumkas twice now. Light on the ears and the plating has not faded even after months.',
            name: 'Rutuja D.',
            city: 'Nagpur',
          },
        ].map((review) => (
          <figure key={review.name} className="flex flex-col gap-3">
            <span className="font-display text-4xl leading-none text-brand-200">“</span>
            <blockquote className="text-sm leading-relaxed text-ink-700">{review.quote}</blockquote>
            <figcaption className="mt-auto text-xs font-semibold text-ink-500">
              {review.name} · {review.city}
            </figcaption>
          </figure>
        ))}
      </section>
    </div>
  );
}
