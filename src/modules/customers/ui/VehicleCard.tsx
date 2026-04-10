import { Trash2 } from 'lucide-react';
import type { Vehicle } from '../schemas/customer.model';
import { ConfirmationOverlay } from '../../../components/ui/ConfirmationOverlay';

interface VehicleCardProps {
  vehicle: Vehicle;
  confirmId: string | null;
  deleting: boolean;
  onRequestDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export const VehicleCard = ({
  vehicle,
  confirmId,
  deleting,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete
}: VehicleCardProps) => (
  <div className="border border-gray-100 rounded-xl p-4 hover:border-brand-accent transition-colors group relative">
    <div className="flex justify-between items-start mb-2">
      <span className="bg-brand-dark text-white px-2 py-1 rounded text-xs font-bold uppercase">
        {vehicle.plate}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onRequestDelete(vehicle.id)}
          className="text-gray-300 hover:text-red-500 transition-colors p-0.5"
          title="Eliminar vehículo"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <h4 className="font-bold text-gray-800 uppercase">{vehicle.brand} {vehicle.model}</h4>
    <p className="text-xs text-gray-400 font-medium">
      {vehicle.year} • {vehicle.color} • {vehicle.mileage} KM
    </p>

    {confirmId === vehicle.id && (
      <ConfirmationOverlay
        title={`¿Eliminar ${vehicle.plate}?`}
        deleting={deleting}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    )}
  </div>
);
