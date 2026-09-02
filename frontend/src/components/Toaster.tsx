import clsx from 'clsx';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { useToasts } from '@/store/toast';

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const tones = {
  success: 'bg-ink-900 text-white',
  error: 'bg-rose-600 text-white',
  info: 'bg-brand-700 text-white',
};

export function Toaster() {
  const toasts = useToasts((s) => s.toasts);
  const dismiss = useToasts((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const Icon = icons[t.tone];
        return (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={clsx(
              'pointer-events-auto flex max-w-md animate-fade-up items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium shadow-pop',
              tones[t.tone],
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {t.message}
          </button>
        );
      })}
    </div>
  );
}
