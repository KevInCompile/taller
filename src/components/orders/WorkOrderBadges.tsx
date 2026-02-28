import type { WorkOrderStatus, WorkOrderPriority } from '../../models/work-order.model';

const STATUS_CONFIG: Record<WorkOrderStatus, { label: string; classes: string; dot: string }> = {
  PENDING: {
    label: 'Pendiente',
    classes: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-400',
  },
  IN_PROGRESS: {
    label: 'En Proceso',
    classes: 'bg-blue-50 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
  },
  COMPLETED: {
    label: 'Completado',
    classes: 'bg-green-50 text-green-700 border border-green-200',
    dot: 'bg-green-500',
  },
  CANCELLED: {
    label: 'Cancelado',
    classes: 'bg-gray-100 text-gray-500 border border-gray-200',
    dot: 'bg-gray-400',
  },
};

interface StatusBadgeProps {
  status: WorkOrderStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const textSize = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${textSize} ${config.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
};

const PRIORITY_CONFIG: Record<WorkOrderPriority, { label: string; classes: string; icon: string }> = {
  LOW: {
    label: 'Baja',
    classes: 'bg-gray-100 text-gray-500 border border-gray-200',
    icon: '↓',
  },
  MEDIUM: {
    label: 'Media',
    classes: 'bg-sky-50 text-sky-700 border border-sky-200',
    icon: '→',
  },
  HIGH: {
    label: 'Alta',
    classes: 'bg-orange-50 text-orange-700 border border-orange-200',
    icon: '↑',
  },
  URGENT: {
    label: 'Urgente',
    classes: 'bg-red-50 text-red-700 border border-red-200',
    icon: '',
  },
};

interface PriorityBadgeProps {
  priority: WorkOrderPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge = ({ priority, size = 'md' }: PriorityBadgeProps) => {
  const config = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.MEDIUM;
  const textSize = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap ${textSize} ${config.classes}`}>
      <span className="text-[10px] leading-none">{config.icon}</span>
      {config.label}
    </span>
  );
};
