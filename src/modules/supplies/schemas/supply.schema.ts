import { z } from 'zod';

export const supplySchema = z.object({
  name:        z.string().min(2, 'El nombre es requerido'),
  description: z.string().min(5, 'La descripción es requerida'),
  price:       z.number().min(0, 'El precio no puede ser negativo'),
  stock:       z.number().int('Debe ser un número entero').min(0, 'El stock no puede ser negativo'),
});

export type SupplyFormData = z.infer<typeof supplySchema>;