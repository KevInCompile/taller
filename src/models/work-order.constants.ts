import type { WorkOrderStatus, WorkOrderPriority } from './work-order.model';

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