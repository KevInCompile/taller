import { z } from 'zod';

export const vehicleSchema = z.object({
  brand: z.string().min(2, "Marca requerida"),
  model: z.string().min(1, "Modelo requerido"),
  plate: z.string().min(6, "Placa inválida"),
  year: z.coerce.number().min(1950).max(2027),
  mileage: z.coerce.number().min(0),
  color: z.string().min(3, "Color requerido"),
  type: z.enum(['CAR', 'MOTORCYCLE']),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
