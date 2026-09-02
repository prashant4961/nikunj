import { create } from 'zustand';

export type Toast = {
  id: number;
  message: string;
  tone: 'success' | 'error' | 'info';
};

type ToastState = {
  toasts: Toast[];
  push: (message: string, tone?: Toast['tone']) => void;
  dismiss: (id: number) => void;
};

export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  push: (message, tone = 'success') => {
    const id = Date.now() + Math.random();
    set((state) => ({ toasts: [...state.toasts, { id, message, tone }] }));
    setTimeout(() => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })), 3200);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message: string) => useToasts.getState().push(message, 'success'),
  error: (message: string) => useToasts.getState().push(message, 'error'),
  info: (message: string) => useToasts.getState().push(message, 'info'),
};
