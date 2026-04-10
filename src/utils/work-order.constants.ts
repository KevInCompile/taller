import type { WorkOrderStatus, WorkOrderPriority } from '../modules/orders/schemas/work-order.model';

export const STATUS_OPTIONS: { value: WorkOrderStatus; label: string }[] = [
  { value: 'PENDING',     label: 'Pendiente'  },
  { value: 'IN_PROGRESS', label: 'En Proceso' },
  { value: 'COMPLETED',   label: 'Completado' },
  { value: 'CANCELLED',   label: 'Cancelado'  },
];

export const PRIORITY_OPTIONS: { value: WorkOrderPriority; label: string }[] = [
  { value: 'LOW',    label: 'Baja'    },
  { value: 'MEDIUM', label: 'Media'   },
  { value: 'HIGH',   label: 'Alta'    },
  { value: 'URGENT', label: 'Urgente' },
];

export const PRIORITY_BORDER: Record<WorkOrderPriority, string> = {
  LOW:    'border-l-gray-300',
  MEDIUM: 'border-l-sky-400',
  HIGH:   'border-l-orange-400',
  URGENT: 'border-l-red-500',
};
