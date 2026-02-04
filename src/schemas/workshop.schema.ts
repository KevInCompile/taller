import { z } from 'zod';

export const workshopSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  nit: z.string().min(9, "NIT debe tener al menos 9 caracteres"),
  phone: z.string().min(7, "Teléfono inválido"),
  email: z.email("Email inválido"),
  address: z.string().min(5, "Mínimo 5 caracteres"),
  // Validamos que sea un FileList de la web api
  logo: z.any().optional()
});
