import { z } from 'zod';

export const profileSchema = z.object({
  firstName:   z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName:    z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  phoneNumber: z.string().min(7, "El teléfono es requerido"),
  dateOfBirth: z.date().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
