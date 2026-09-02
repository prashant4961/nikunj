import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { STORE } from '@/lib/constants';
import { useAuth } from '@/store/auth';
import { useCart } from '@/store/cart';
import type { Category } from '@/types';

function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get<Category[]>('/products/categories')).data,
    staleTime: 5 * 60 * 1000,
  });
}

function AccountMenu() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/95 transition hover:bg-white/10"
      >
        <UserIcon className="h-[18px] w-[18px]" />
        <span className="hidden sm:inline">Login</span>
      </Link>
    );
  }

  const links = [
    { to: '/profile', label: 'My Profile', icon: UserIcon },
    { to: '/orders', label: 'My Orders', icon: Package },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
    ...(user.role === 'ADMIN'
      ? [{ to: '/admin', label: 'Admin Panel', icon: LayoutDashboard }]
      : []),
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/95 transition hover:bg-white/10"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-400 text-xs font-bold text-brand-900">
          {user.fullName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-[7rem] truncate sm:inline">
          {user.fullName.split(' ')[0]}
        </span>
        <ChevronDown className={clsx('h-4 w-4 transition', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 animate-fade-up overflow-hidden rounded-2xl bg-white p-1.5 shadow-pop">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-ink-900">{user.fullName}</p>
            <p className="truncate text-xs text-ink-500">{user.email}</p>
          </div>
          <div className="my-1 h-px bg-black/5" />
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          <div className="my-1 h-px bg-black/5" />
          <button
            onClick={() => {
              logout();
              setOpen(false);
              navigate('/');
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

function SearchBar({ className }: { className?: string }) {
  const [params] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') ?? '');
  const navigate = useNavigate();

  useEffect(() => setTerm(params.get('q') ?? ''), [params]);

  return (
    <form
      className={clsx('relative flex-1', className)}
      onSubmit={(event) => {
        event.preventDefault();
        navigate(term.trim() ? `/shop?q=${encodeURIComponent(term.trim())}` : '/shop');
      }}
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
      <input
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search for necklaces, jhumkas, bridal sets…"
        className="w-full rounded-xl border border-transparent bg-white py-3 pl-11 pr-4 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-gold-300 focus:ring-4 focus:ring-white/20"
      />
    </form>
  );
}

export function Header() {
  const cartCount = useCart((s) => s.count());
  const user = useAuth((s) => s.user);
  const { data: categories = [] } = useCategories();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-ink-900 py-1.5 text-center text-[11px] font-medium tracking-wide text-gold-200">
        Free delivery above ₹999 · Flat 20% off on bridal jewellery · Cash on delivery available
      </div>

      <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-800">
        <div className="container-page flex items-center gap-3 py-3">
          <button
            className="grid h-10 w-10 place-items-center rounded-xl text-white lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400 font-display text-xl font-bold text-brand-900">
              N
            </span>
            <span className="hidden sm:block">
              <span className="block font-display text-lg font-bold leading-tight text-white">
                {STORE.name}
              </span>
              <span className="block text-[11px] font-medium italic leading-tight text-gold-200">
                {STORE.tagline}
              </span>
            </span>
          </Link>

          <SearchBar className="mx-2 hidden md:block" />

          <div className="ml-auto flex items-center gap-1">
            <NavLink
              to="/wishlist"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/95 transition hover:bg-white/10 sm:flex"
            >
              <Heart className="h-[18px] w-[18px]" />
              <span className="hidden lg:inline">Wishlist</span>
            </NavLink>

            <AccountMenu />

            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/95 transition hover:bg-white/10"
            >
              <span className="relative">
                <ShoppingBag className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-brand-900">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="hidden lg:inline">Bag</span>
            </Link>
          </div>
        </div>

        <div className="container-page pb-3 md:hidden">
          <SearchBar />
        </div>
      </div>

      <nav className="border-b border-black/5 bg-white shadow-sm">
        <div className="container-page no-scrollbar flex items-center gap-1 overflow-x-auto py-2">
          <NavLink
            to="/shop"
            end
            className={({ isActive }) =>
              clsx(
                'whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-semibold transition',
                isActive ? 'bg-brand-700 text-white' : 'text-ink-700 hover:bg-brand-50',
              )
            }
          >
            All Jewellery
          </NavLink>
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-semibold text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {category.name}
            </Link>
          ))}
          <span className="ml-auto hidden items-center gap-4 pl-4 text-[13px] font-medium text-ink-500 lg:flex">
            <Link to="/about" className="hover:text-brand-700">
              About
            </Link>
            <Link to="/contact" className="hover:text-brand-700">
              Contact
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="font-semibold text-brand-700">
                Admin
              </Link>
            )}
          </span>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-b border-black/5 bg-white px-4 py-3 shadow-sm lg:hidden">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">Menu</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-4 w-4 text-ink-500" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['/shop', '/wishlist', '/orders', '/profile', '/about', '/contact'].map((path) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-brand-50 px-3 py-2 text-sm font-semibold capitalize text-brand-700"
              >
                {path.replace('/', '')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
