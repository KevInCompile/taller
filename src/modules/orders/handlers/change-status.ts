import { toast } from "sonner";
import { workOrderService } from "../../../api/work-order.service";
import { STATUS_OPTIONS } from "../../../utils/work-order.constants";
import type { WorkOrder, WorkOrderStatus } from "../schemas/work-order.model";
import Swal from "sweetalert2";
import { shortId } from "../../../helpers/helpers";

const handleChangeStatus = async (order: WorkOrder, refresh: () => Promise<void>) => {
  const inputOptions = Object.fromEntries(
    STATUS_OPTIONS.map(o => [o.value, o.label]),
  );

  const { isConfirmed } = await Swal.fire<WorkOrderStatus>({
    title: 'Cambiar Estado',
    html: `<p class="text-sm text-gray-500">Orden de <strong>${order.customer?.firstName ?? ''} ${order.customer?.lastName ?? ''}</strong><br/><span class="font-mono text-xs text-gray-400">#${shortId(order.id)}</span></p>`,
    input: 'select',
    inputOptions,
    inputValue: order.status,
    inputAttributes: { style: 'padding: 10px 12px; border-radius: 10px; border: 1px solid #e5e7eb; font-size: 14px; width: 90%;' },
    showCancelButton: true,
    confirmButtonColor: '#F2633C',
    cancelButtonColor: '#1F2937',
    confirmButtonText: 'Cambiar Estado',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    showLoaderOnConfirm: true,
    preConfirm: async (newStatus) => {
      if (!newStatus || order.status === newStatus) return;
      try {
        await workOrderService.updateStatus(order.id, newStatus);
        toast.success('Estado cambiado exitosamente');
      } catch {
        toast.error('Error al cambiar el estado');
      }
    }
  });

  if (isConfirmed) {
    refresh();
  }
};

 export {handleChangeStatus}
