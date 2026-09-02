import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, AUTH_TOKEN_KEY } from '@/lib/api';
import type { User } from '@/types';

type AuthState = {
  user: User | null;
  token: string | null;
  isAdmin: () => boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<User>;
  logout: () => void;
  setUser: (user: User) => void;
  refresh: () => Promise<void>;
};

function persistSession(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      isAdmin: () => get().user?.role === 'ADMIN',

      login: async (email, password) => {
        const { data } = await api.post<{ user: User; token: string }>('/auth/login', {
          email,
          password,
        });
        persistSession(data.token);
        set({ user: data.user, token: data.token });
        return data.user;
      },

      register: async (input) => {
        const { data } = await api.post<{ user: User; token: string }>('/auth/register', input);
        persistSession(data.token);
        set({ user: data.user, token: data.token });
        return data.user;
      },

      logout: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        set({ user: null, token: null });
      },

      setUser: (user) => set({ user }),

      refresh: async () => {
        if (!get().token) return;
        try {
          const { data } = await api.get<{ user: User }>('/auth/me');
          set({ user: data.user });
        } catch {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          set({ user: null, token: null });
        }
      },
    }),
    {
      name: 'nikunj.auth',
      onRehydrateStorage: () => (state) => {
        if (state?.token) persistSession(state.token);
      },
    },
  ),
);
