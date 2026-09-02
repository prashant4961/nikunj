import clsx from 'clsx';
import { LayoutDashboard, LogOut, Package, ShoppingCart, Store, Users } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { STORE } from '@/lib/constants';
import { useAuth } from '@/store/auth';

const nav = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', end: false, label: 'Products', icon: Package },
  { to: '/admin/orders', end: false, label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', end: false, label: 'Customers', icon: Users },
];

export function AdminLayout() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas lg:flex">
      <aside className="border-b border-black/5 bg-ink-900 text-white/80 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-400 font-display text-lg font-bold text-brand-900">
            N
          </span>
          <span>
            <span className="block font-display text-sm font-bold text-white">{STORE.name}</span>
            <span className="block text-[11px] text-gold-200">Admin panel</span>
          </span>
        </div>

        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                  isActive ? 'bg-brand-700 text-white' : 'text-white/70 hover:bg-white/10',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden px-3 lg:mt-auto lg:block">
          <div className="rounded-xl bg-white/5 p-3 text-xs">
            <p className="font-semibold text-white">{user?.fullName}</p>
            <p className="truncate text-white/50">{user?.email}</p>
          </div>
          <Link
            to="/"
            className="mt-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10"
          >
            <Store className="h-4 w-4" /> View storefront
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="mb-5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}
