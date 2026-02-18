import { z } from 'zod';

export const customerSchema = z.object({
  firstName: z.string().min(2, "El nombre es muy corto"),
  lastName: z.string().min(2, "El apellido es muy corto"),
  email: z.email("Email inválido"),
  phone: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
  address: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
