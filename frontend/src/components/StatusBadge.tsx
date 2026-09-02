import clsx from 'clsx';
import { STATUS_LABEL, STATUS_TONE } from '@/lib/constants';
import type { OrderStatus } from '@/types';

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={clsx('chip', STATUS_TONE[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}
