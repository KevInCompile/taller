import { useState } from 'react';
import { toast } from 'sonner';
import { customerService } from '../../../api/customer.service';

export const useDeleteVehicle = (onSuccess: () => void) => {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const requestDelete = (vehicleId: string) => {
    setConfirmId(vehicleId);
  };

  const cancelDelete = () => {
    setConfirmId(null);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await customerService.deleteVehicle(confirmId);
      toast.success('Vehículo eliminado correctamente');
      setConfirmId(null);
      onSuccess();
    } catch {
      toast.error('Error al eliminar el vehículo');
    } finally {
      setDeleting(false);
    }
  };

  return {
    confirmId,
    deleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
};
