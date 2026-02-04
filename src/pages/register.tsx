import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/auth.schema';
import { Loader2, ShieldCheck } from 'lucide-react';
import type z from 'zod';
import { authService } from '../api/auth.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al registrar");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Lado Izquierdo: Visual (Oculto en móvil) */}
      <div className={`hidden lg:flex bg-brand-dark flex-col justify-center p-12 text-white bg-[url('https://images.unsplash.com/photo-1486006396193-471068589b58?auto=format&fit=crop&q=80')] bg-cover bg-center bg-blend-overlay`}>
        <h1 className="text-5xl font-extrabold text-brand-accent">TALLER NOW</h1>
        <p className="mt-4 text-xl text-gray-300">La herramienta definitiva para mecánicos expertos.</p>
        <ul className="mt-8 space-y-4 text-gray-400">
          <li className="flex items-center gap-2"><ShieldCheck className="text-brand-accent"/> Gestión de Inventario Real-time</li>
          <li className="flex items-center gap-2"><ShieldCheck className="text-brand-accent"/> Control de Servicios y Citas</li>
          <li className="flex items-center gap-2"><ShieldCheck className="text-brand-accent"/> Integración Directa con WhatsApp</li>
        </ul>
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <header className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
            <p className="text-gray-500">Únete a nuestra plataforma de gestión.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Nombre</label>
                <input {...register("firstName")} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" placeholder="Luna" />
                {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message?.toString()}</span>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Apellido</label>
                <input {...register("lastName")} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" placeholder="Maria" />
                {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message?.toString()}</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
              <input {...register("email")} type="email" className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" placeholder="luna16@gmail.com" />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message?.toString()}</span>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
              <input {...register("password")} type="password" className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" placeholder="••••••••" />
              {errors.password && <span className="text-xs text-red-500">{errors.password.message?.toString()}</span>}
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <input {...register("habeas_data")} type="checkbox" className="mt-1 h-4 w-4 accent-brand-accent" />
              <p className="text-xs text-orange-900">
                Acepto el tratamiento de mis datos personales (Habeas Data) para la gestión del taller y comunicaciones de servicio.
              </p>
            </div>
            {errors.habeas_data && <p className="text-xs text-red-500">{errors.habeas_data.message?.toString()}</p>}

            <button disabled={isSubmitting} className="w-full py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg cursor-pointer">
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Registrarse ahora'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
