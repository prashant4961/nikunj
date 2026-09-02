import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="font-display text-xl text-ink-900">{title}</h3>
      <p className="max-w-sm text-sm text-ink-500">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary mt-2">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
