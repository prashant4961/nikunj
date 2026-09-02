import { Loader2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiErrorMessage } from '@/lib/api';
import { STORE } from '@/lib/constants';
import { useAuth } from '@/store/auth';
import { toast } from '@/store/toast';

function AuthAside() {
  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-800 to-brand-600 p-10 text-white lg:block">
      <img
        src="/images/products/set-5.jpeg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="relative flex h-full flex-col">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-400 font-display text-2xl font-bold text-brand-900">
          N
        </span>
        <h2 className="mt-auto font-display text-3xl font-bold leading-tight">
          Jewellery worth coming back for
        </h2>
        <p className="mt-3 max-w-sm text-sm text-white/80">
          Log in to track orders, save your favourite pieces and check out faster next time.
        </p>
        <p className="mt-6 text-xs text-white/60">
          {STORE.name} · {STORE.address}
        </p>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuth((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}`);
      navigate(user.role === 'ADMIN' ? '/admin' : redirectTo, { replace: true });
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10">
      <div className="card mx-auto grid max-w-4xl overflow-hidden lg:grid-cols-2">
        <AuthAside />

        <div className="p-8 sm:p-10">
          <h1 className="font-display text-2xl font-bold text-ink-900">Login</h1>
          <p className="mt-1 text-sm text-ink-500">Good to see you again.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
                <input
                  id="email"
                  type="email"
                  required
                  className="field pl-11"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
                <input
                  id="password"
                  type="password"
                  required
                  className="field pl-11"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />
              </div>
            </div>

            <button className="btn-primary w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Login
            </button>
          </form>

          <p className="mt-6 text-sm text-ink-500">
            New to {STORE.name}?{' '}
            <Link to="/register" className="font-semibold text-brand-700 hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-6 rounded-xl bg-brand-50/70 p-3 text-xs text-ink-500">
            <p className="font-semibold text-ink-700">Demo accounts</p>
            <p>Customer — demo@nikunjcreation.com / Demo@123</p>
            <p>Admin — admin@nikunjcreation.com / Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  const register = useAuth((s) => s.register);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to ${STORE.name}, ${user.fullName.split(' ')[0]}`);
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not create your account'));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'fullName' as const, label: 'Full name', type: 'text', placeholder: 'Priya Sharma' },
    { key: 'email' as const, label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { key: 'phone' as const, label: 'Mobile number', type: 'tel', placeholder: '9876543210' },
    { key: 'password' as const, label: 'Password', type: 'password', placeholder: 'At least 6 characters' },
  ];

  return (
    <div className="container-page py-10">
      <div className="card mx-auto grid max-w-4xl overflow-hidden lg:grid-cols-2">
        <AuthAside />

        <div className="p-8 sm:p-10">
          <h1 className="font-display text-2xl font-bold text-ink-900">Create your account</h1>
          <p className="mt-1 text-sm text-ink-500">It takes less than a minute.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="label" htmlFor={field.key}>
                  {field.label}
                </label>
                <input
                  id={field.key}
                  type={field.type}
                  required
                  className="field"
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, [field.key]: event.target.value }))
                  }
                />
              </div>
            ))}

            <button className="btn-primary w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </button>
          </form>

          <p className="mt-6 text-sm text-ink-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-700 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
