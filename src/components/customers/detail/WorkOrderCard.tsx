import { Calendar, DollarSign, Wrench } from 'lucide-react';
import { StatusBadge } from '../../ui/StatusBadge';
import { formatCurrency, formatDate } from '../../../helpers/helpers';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, PRIORITY_BORDER } from '../../../models/work-order.constants';
import type { Vehicle, WorkOrder } from '../../../models/customer.model';

interface WorkOrderCardProps {
  order: WorkOrder;
  vehicles: Vehicle[];
}

export const WorkOrderCard = ({ order, vehicles }: WorkOrderCardProps) => {
  const status = STATUS_OPTIONS.find(s => s.value === order.status)?.label || order.status;
  const priority = PRIORITY_OPTIONS.find(p => p.value === order.priority)?.label || order.priority;
  const priorityClass = PRIORITY_BORDER[order.priority as keyof typeof PRIORITY_BORDER] || 'border-l-gray-300';
  const vehicle = vehicles.find(v => v.id === order.vehicleId);

  return (
    <div className={`border-l-4 ${priorityClass} border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-gray-800">{order.description}</h4>
          <div className="flex items-center gap-4 mt-1">
            <StatusBadge status={order.status} label={status} />
            <span className="text-xs text-gray-500 font-medium">
              {vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plate})` : 'Vehículo no encontrado'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-800">{formatCurrency(order.total)}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Wrench size={14} className="text-gray-400" />
          <span className="text-gray-600">{order.mechanic || 'Sin asignar'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span className="text-gray-600">{formatDate(order.startDate.toString())}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-gray-400" />
          <span className="text-gray-600">Prioridad: {priority}</span>
        </div>
      </div>

      {order.additionalNotes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Notas:</span> {order.additionalNotes}
          </p>
        </div>
      )}
    </div>
  );
};