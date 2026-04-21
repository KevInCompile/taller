import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/auth.schema';
import { Loader2 } from 'lucide-react';
import type z from 'zod';
import { authService } from '../api/auth.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import SideLeft from '../components/ui/SideLeft';

export const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema)
  });
  const navigate = useNavigate()

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      await authService.register(data);
      toast.success(`¡Registro exitoso!`)
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al registrar");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Izquierdo: Visual (Oculto en móvil) */}
     <SideLeft />
      {/* Lado Derecho: Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 dark:bg-gray-50 bg-white">
        <div className="max-w-md w-full">
          <header className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Crear Cuenta</h2>
            <p className="text-gray-500">Únete a nuestra plataforma de gestión.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground">Nombre</label>
              <input {...register("firstName")} className="w-full mt-1 p-3 bg-white border border-border-elements text-elements rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" placeholder="Luna" />
                {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message?.toString()}</span>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground">Apellido</label>
              <input {...register("lastName")} className="w-full mt-1 p-3 bg-white border border-border-elements text-elements rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" placeholder="Maria" />
                {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message?.toString()}</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground">Correo Electrónico</label>
            <input {...register("email")} type="email" className="w-full mt-1 p-3 bg-white border border-border-elements text-elements rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" placeholder="luna16@gmail.com" />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message?.toString()}</span>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground">Contraseña</label>
            <input {...register("password")} type="password" className="w-full mt-1 p-3 bg-white border border-border-elements text-elements rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" placeholder="••••••••" />
              {errors.password && <span className="text-xs text-red-500">{errors.password.message?.toString()}</span>}
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <input {...register("habeas_data")} type="checkbox" className="mt-1 h-4 w-4 accent-brand-accent" />
              <p className="text-xs text-orange-900">
                Acepto el tratamiento de mis datos personales (Habeas Data) para la gestión del taller y comunicaciones de servicio.
              </p>
            </div>
            {errors.habeas_data && <p className="text-xs text-red-500">{errors.habeas_data.message?.toString()}</p>}

            <button
              disabled={isSubmitting}
              className="w-full bg-brand-accent hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-semibold py-3.5 rounded-xl transition-all duration-200
                 hover:shadow-orange-300 hover:-translate-y-0.5
                active:translate-y-0 flex items-center justify-center gap-2 text-sm mt-2"
              >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Registrarse ahora'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
