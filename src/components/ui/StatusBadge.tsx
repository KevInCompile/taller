import type { WorkOrderStatus } from '../../models/work-order.model';

interface StatusBadgeProps {
  status: WorkOrderStatus | string;
  label?: string;
}

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getDefaultLabel = () => {
    switch (status) {
      case 'COMPLETED': return 'Completado';
      case 'IN_PROGRESS': return 'En Proceso';
      case 'CANCELLED': return 'Cancelado';
      default: return 'Pendiente';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusClasses()}`}>
      {label || getDefaultLabel()}
    </span>
  );
};