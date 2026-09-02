import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STORE } from '@/lib/constants';

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All Jewellery', to: '/shop' },
      { label: 'Bridal Collection', to: '/shop?category=Bridal%20Collection' },
      { label: 'Temple Jewellery', to: '/shop?category=Temple%20Jewellery' },
      { label: 'Earrings', to: '/shop?category=Earrings' },
    ],
  },
  {
    title: 'Your Account',
    links: [
      { label: 'My Profile', to: '/profile' },
      { label: 'My Orders', to: '/orders' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Bag', to: '/cart' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-ink-900 text-white/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400 font-display text-xl font-bold text-brand-900">
              N
            </span>
            <span>
              <span className="block font-display text-lg font-bold text-white">{STORE.name}</span>
              <span className="block text-xs italic text-gold-200">{STORE.tagline}</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Traditional kundan, temple and oxidised jewellery made by hand in Maharashtra. Every piece
            is checked, polished and packed by our own team before it reaches you.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gold-200">
              {column.title}
            </h4>
            <ul className="space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gold-200">Reach Us</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              {STORE.phone}
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              {STORE.email}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              {STORE.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {STORE.name}. All rights reserved.
      </div>
    </footer>
  );
}
