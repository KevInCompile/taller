import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { authService } from '../api/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import {
  Mail, Lock, Loader2, Eye, EyeOff, CarFront,
  ClipboardList, Package, Users, TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

// Feature bullet
const Feature = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-brand-accent">
      {icon}
    </div>
    <p className="text-sm text-gray-300 font-medium">{text}</p>
  </div>
);

export const LoginPage = () => {
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data);
      setAuth(response.token);
      toast.success('¡Bienvenido de nuevo!', {
        description: 'Redirigiendo al panel de control...',
      });
      setTimeout(() => navigate('/'), 1200);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || 'Credenciales incorrectas',
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left brand panel */}
      <div className="hidden lg:flex lg:w-[52%] bg-brand-dark flex-col justify-between p-14 relative overflow-hidden">

        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-accent/10 pointer-events-none" />
        <div className="absolute top-1/2 -left-16 w-56 h-56 rounded-full bg-white/3 pointer-events-none" />
        <div className="absolute -bottom-20 right-10 w-72 h-72 rounded-full bg-brand-accent/5 pointer-events-none" />

        {/* Top — Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/30">
              <CarFront size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              TALLER <span className="text-brand-accent">NOW</span>
            </span>
          </div>
        </div>

        {/* Middle — Headline + features */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white leading-snug">
              Gestiona tu taller,<br />
              <span className="text-brand-accent">controla tu negocio.</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              La plataforma integral para talleres modernos. Órdenes,
              inventario, clientes y finanzas en un solo lugar.
            </p>
          </div>

          <div className="space-y-4">
            <Feature icon={<ClipboardList size={16} />} text="Órdenes de trabajo en tiempo real" />
            <Feature icon={<Package size={16} />} text="Control de inventario y suministros" />
            <Feature icon={<Users size={16} />} text="Gestión de clientes y vehículos" />
            <Feature icon={<TrendingUp size={16} />} text="Ingresos y reportes del taller" />
          </div>
        </div>

        {/* Bottom — Tagline */}
        <div className="relative z-10 flex items-center gap-2">
          {/*<CheckCircle2 size={14} className="text-brand-accent shrink-0" />
          <p className="text-xs text-gray-500">
            Software de gestión profesional para talleres automotrices
          </p>*/}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-6 py-12">

        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-9 h-9 bg-brand-accent rounded-xl flex items-center justify-center">
            <CarFront size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">
            TALLER <span className="text-brand-accent">NOW</span>
          </span>
        </div>

        {/* Card */}
        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Bienvenido de nuevo</h2>
            <p className="text-gray-400 text-sm mt-1.5">
              Ingresa tus credenciales para acceder al panel.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="correo@taller.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm outline-none transition-all shadow-sm
                    ${errors.email
                      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[11px] mt-1.5 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-11 py-3 bg-white border rounded-xl text-sm outline-none transition-all shadow-sm
                    ${errors.password
                      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                  tabIndex={-1}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[11px] mt-1.5 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-accent hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-bold py-3.5 rounded-xl transition-all duration-200
                shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5
                active:translate-y-0 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Ingresando...
                </>
              ) : (
                'Ingresar al panel'
              )}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-[11px] text-gray-400 mt-10">
            © {new Date().getFullYear()} Taller Now · Todos los derechos reservados
          </p>
        </div>
      </div>

    </div>
  );
};
