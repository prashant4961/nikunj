import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Heart, KeyRound, Loader2, LogOut, Package, UserCog } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, apiErrorMessage } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { toast } from '@/store/toast';
import type { User } from '@/types';

type Tab = 'profile' | 'password';

export function Profile() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName ?? '',
    phone: user?.phone ?? '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  const updateProfile = useMutation({
    mutationFn: async () => (await api.put<{ user: User }>('/auth/me', profileForm)).data.user,
    onSuccess: (updated) => {
      setUser(updated);
      toast.success('Profile updated');
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update your profile')),
  });

  const changePassword = useMutation({
    mutationFn: async () => api.put('/auth/me/password', passwordForm),
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast.success('Password changed successfully');
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not change your password')),
  });

  if (!user) return null;

  const shortcuts = [
    { to: '/orders', label: 'My orders', copy: 'Track and manage', icon: Package },
    { to: '/wishlist', label: 'Wishlist', copy: 'Saved pieces', icon: Heart },
  ];

  return (
    <div className="container-page py-6">
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <div className="card p-6 text-center">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-700 font-display text-3xl font-bold text-gold-300">
              {user.fullName.charAt(0).toUpperCase()}
            </span>
            <h1 className="mt-3 font-display text-xl font-bold text-ink-900">{user.fullName}</h1>
            <p className="text-sm text-ink-500">{user.email}</p>
            <p className="mt-2 text-xs text-ink-300">Member since {formatDate(user.createdAt)}</p>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="btn-outline mt-4 w-full py-2 text-xs">
                Open admin panel
              </Link>
            )}
          </div>

          <div className="card divide-y divide-black/5 overflow-hidden">
            {shortcuts.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-5 py-4 transition hover:bg-brand-50"
              >
                <item.icon className="h-4 w-4 text-brand-700" />
                <span>
                  <span className="block text-sm font-semibold text-ink-900">{item.label}</span>
                  <span className="block text-xs text-ink-500">{item.copy}</span>
                </span>
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                navigate('/');
                toast.info('You have been logged out');
              }}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4 text-rose-600" />
              <span className="text-sm font-semibold text-rose-600">Logout</span>
            </button>
          </div>
        </aside>

        <section className="card p-6">
          <div className="mb-6 flex gap-2 border-b border-black/5">
            {(
              [
                { value: 'profile', label: 'Personal details', icon: UserCog },
                { value: 'password', label: 'Password', icon: KeyRound },
              ] as const
            ).map((item) => (
              <button
                key={item.value}
                onClick={() => setTab(item.value)}
                className={clsx(
                  '-mb-px flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition',
                  tab === item.value
                    ? 'border-brand-700 text-brand-700'
                    : 'border-transparent text-ink-500 hover:text-ink-900',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          {tab === 'profile' ? (
            <form
              className="max-w-lg space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                updateProfile.mutate();
              }}
            >
              <div>
                <label className="label" htmlFor="fullName">
                  Full name
                </label>
                <input
                  id="fullName"
                  className="field"
                  value={profileForm.fullName}
                  onChange={(event) =>
                    setProfileForm((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                />
              </div>

              <div>
                <label className="label" htmlFor="phone">
                  Mobile number
                </label>
                <input
                  id="phone"
                  className="field"
                  inputMode="numeric"
                  maxLength={10}
                  value={profileForm.phone}
                  onChange={(event) =>
                    setProfileForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input className="field bg-black/[0.03]" value={user.email} disabled />
              </div>

              <button className="btn-primary" disabled={updateProfile.isPending}>
                {updateProfile.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save changes
              </button>
            </form>
          ) : (
            <form
              className="max-w-lg space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                changePassword.mutate();
              }}
            >
              <div>
                <label className="label" htmlFor="currentPassword">
                  Current password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  className="field"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                  }
                />
              </div>

              <div>
                <label className="label" htmlFor="newPassword">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="field"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
                  }
                />
                <p className="mt-1 text-xs text-ink-500">Use at least 6 characters.</p>
              </div>

              <button className="btn-primary" disabled={changePassword.isPending}>
                {changePassword.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Change password
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
