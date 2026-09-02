import { Star } from 'lucide-react';
import clsx from 'clsx';

export function Rating({
  value,
  count,
  size = 'sm',
}: {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={clsx(
          'chip bg-emerald-600 text-white',
          size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs',
        )}
      >
        {value.toFixed(1)}
        <Star className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} fill="currentColor" />
      </span>
      {count !== undefined && (
        <span className="text-xs font-medium text-ink-500">({count.toLocaleString('en-IN')})</span>
      )}
    </div>
  );
}
