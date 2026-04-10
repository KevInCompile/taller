import Swal from "sweetalert2";
import { shortId } from "../../../helpers/helpers";
import type { WorkOrder } from "../../../models/work-order.model";
import { workOrderService } from "../../../api/work-order.service";
import { toast } from "sonner";

const handleDelete = async (order: WorkOrder, refresh: () => Promise<void>) => {
  const result = await Swal.fire({
    title: '¿Eliminar orden?',
    html: `Esta acción eliminará la orden <strong>#${shortId(order.id)}</strong> de <strong>${order.customer?.firstName ?? ''} ${order.customer?.lastName ?? ''}</strong>. No se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#1F2937',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await workOrderService.delete(order.id);
      refresh();
      toast.success('La orden ha sido eliminada correctamente.')
    } catch {
      toast.error('No se pudo eliminar la orden. Intenta nuevamente.')
    }
  }
};

export { handleDelete };
