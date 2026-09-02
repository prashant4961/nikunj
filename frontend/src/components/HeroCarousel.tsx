import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: '/images/banners/banner1.png',
    eyebrow: 'Wedding Season Edit',
    title: 'Bridal sets that carry a story',
    copy: 'Hand-set kundan and polki, finished in our Gangakhed workshop.',
    cta: { label: 'Shop bridal', to: '/shop?category=Bridal%20Collection' },
  },
  {
    image: '/images/banners/banner2.png',
    eyebrow: 'Temple Jewellery',
    title: 'Antique gold, made the old way',
    copy: 'Lakshmi coin haars, vankis and kolhapuri saaj in antique finish.',
    cta: { label: 'Explore temple', to: '/shop?category=Temple%20Jewellery' },
  },
  {
    image: '/images/banners/banner3.png',
    eyebrow: 'Everyday Edit',
    title: 'Light pieces, up to 50% off',
    copy: 'Jhumkas, studs and oxidised silver you can wear all day.',
    cta: { label: 'Shop the edit', to: '/shop?sort=discount' },
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const go = useCallback((next: number) => setIndex((next + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand-900 shadow-card">
      <div className="relative aspect-[16/9] sm:aspect-[21/9]">
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            className={clsx(
              'absolute inset-0 transition-opacity duration-700',
              i === index ? 'opacity-100' : 'opacity-0',
            )}
          >
            <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 pb-10 sm:p-8 sm:pb-12">
              <div className="max-w-lg">
                <span className="chip bg-gold-400/95 text-brand-900">{slide.eyebrow}</span>
                <h2 className="mt-2 font-display text-xl font-bold leading-tight text-white drop-shadow sm:text-3xl">
                  {slide.title}
                </h2>
                <p className="mt-1.5 hidden max-w-md text-sm text-white/85 sm:block">{slide.copy}</p>
              </div>
              <Link to={slide.cta.to} className="btn-gold shrink-0">
                {slide.cta.label}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-800 transition hover:bg-white sm:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-800 transition hover:bg-white sm:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => go(i)}
            className={clsx(
              'h-1.5 rounded-full transition-all',
              i === index ? 'w-7 bg-gold-300' : 'w-2.5 bg-white/50',
            )}
          />
        ))}
      </div>
    </div>
  );
}
