import Swal from "sweetalert2";
import type { Customer } from "../../../models/customer.model";
import { customerService } from "../../../api/customer.service";
import { toast } from "sonner";

 const handleDeleteCustomer = async (customer: Customer, refresh: () => Promise<void>) => {
   const result = await Swal.fire({
     title: '¿Eliminar cliente?',
     html: `Esta acción eliminará a <strong>${customer.firstName} ${customer.lastName}</strong> y todos sus datos asociados.`,
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
       await customerService.delete(customer.id);
       refresh();
       toast.success("Cliente eliminado correctamente.")
     } catch {
       toast.error("No se pudo eliminar el cliente. Intenta nuevamente.")
     }
   }
 };

 export { handleDeleteCustomer };
