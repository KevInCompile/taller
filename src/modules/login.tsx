import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { authService } from '../api/auth.service';
import { workshopService } from '../api/user.service';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, Loader2, Eye, EyeOff, CarFront } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import SideLeft from '../components/ui/SideLeft';

export const LoginPage = () => {
  const setAuth = useAuthStore(state => state.setAuth);
  const setWorkshop = useAuthStore(state => state.setWorkshop);
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

      try {
        const workshop = await workshopService.getMyWorkshop();
        setWorkshop(workshop);
      } catch {
        setWorkshop(null);
      }

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

  useEffect(() => {
    window.document.title = 'Inicia sesión y gestiona tu taller'
  }, [])

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <SideLeft />
      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-6 py-12">

        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-9 h-9 bg-brand-accent rounded-xl flex items-center justify-center">
            <CarFront size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">
            TALLER <span className="text-brand-accent">NOW</span>
          </span>
        </div>

        {/* Card */}
        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Bienvenido de nuevo</h2>
            <p className="text-gray-400 text-sm mt-1.5">
              Ingresa tus credenciales para acceder al panel.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
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
                  className={`text-elements w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm outline-none transition-all shadow-sm
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
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
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
                  className={`text-elements w-full pl-10 pr-11 py-3 bg-white border rounded-xl text-sm outline-none transition-all shadow-sm
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
                 hover:shadow-orange-300 hover:-translate-y-0.5
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
