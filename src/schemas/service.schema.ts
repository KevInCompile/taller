import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(2, 'El nombre del servicio debe tener al menos 2 caracteres'),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;