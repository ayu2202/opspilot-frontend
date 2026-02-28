import { WorkItemStatus } from '../contracts';
import { Circle, Loader2, CheckCircle2, XOctagon } from 'lucide-react';

const config = {
  [WorkItemStatus.OPEN]: {
    classes: 'bg-slate-100 text-slate-700',
    Icon: Circle,
    label: 'OPEN',
  },
  [WorkItemStatus.IN_PROGRESS]: {
    classes: 'bg-blue-50 text-blue-700',
    Icon: Loader2,
    label: 'IN PROGRESS',
  },
  [WorkItemStatus.COMPLETED]: {
    classes: 'bg-green-50 text-green-700',
    Icon: CheckCircle2,
    label: 'COMPLETED',
  },
  [WorkItemStatus.REJECTED]: {
    classes: 'bg-red-50 text-red-700',
    Icon: XOctagon,
    label: 'REJECTED',
  },
};

export default function StatusBadge({ status }) {
  const c = config[status] || {
    classes: 'bg-slate-100 text-slate-600',
    Icon: Circle,
    label: status ?? '—',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.classes}`}
    >
      <c.Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}
