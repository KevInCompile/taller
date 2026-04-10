import { z } from 'zod';

export const vehicleSchema = z.object({
  brand: z.string().min(2, "Marca requerida"),
  model: z.string().min(1, "Modelo requerido"),
  plate: z.string().min(6, "Placa inválida"),
  year: z.number().min(2, "Año inválido"),
  mileage: z.number().min(0),
  color: z.string().min(3, "Color requerido"),
  type: z.enum(['CAR', 'MOTORCYCLE']),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
