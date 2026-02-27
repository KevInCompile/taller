import { z } from 'zod';

export const supplyItemSchema = z.object({
  supplyId: z.string().min(1, 'Selecciona un suministro'),
  quantity: z.number().min(1, 'La cantidad mínima es 1'),
});

export const workOrderSchema = z.object({
  customerId:      z.string().min(1, 'Selecciona un cliente'),
  vehicleId:       z.string().min(1, 'Selecciona un vehículo'),
  serviceId:       z.string().min(1, 'Selecciona un servicio'),
  mechanic:        z.string().min(2, 'El nombre del mecánico es requerido'),
  priority:        z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  startDate:       z.string().min(1, 'La fecha de inicio es requerida'),
  description:     z.string().min(5, 'La descripción es requerida'),
  additionalNotes: z.string().optional().or(z.literal('')),
  supplies:        z.array(supplyItemSchema),
  subtotal:        z.number().min(0, 'El subtotal no puede ser negativo'),
  total:           z.number().min(0, 'El total no puede ser negativo'),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;
export type SupplyItemFormData = z.infer<typeof supplyItemSchema>;