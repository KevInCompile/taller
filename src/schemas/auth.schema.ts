import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "El nombre es muy corto"),
  lastName: z.string().min(2, "El apellido es muy corto"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  habeas_data: z.boolean().refine(val => val === true, {
    message: "Debes aceptar el tratamiento de datos"
  }),
  // Estos los podemos manejar internamente o como campos ocultos
  avatar: z.url().default("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEeggv64JpzHKJqt-DEcT79UNY_ckScL97MA&s"),
  sessionFacebook: z.boolean().default(true),
  sessionGoogle: z.boolean().default(true),
});
export type LoginFormData = z.infer<typeof loginSchema>;
