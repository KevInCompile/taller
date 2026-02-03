import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { authService } from '../api/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, Loader2 } from 'lucide-react';

export const LoginPage = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

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

      setAuth(response.user, response.token);

      alert("¡Bienvenido al taller!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="luna16@gmail.com"
                  className={`w-full pl-10 p-3 bg-gray-50 border rounded-lg outline-none transition ${
                    errors.email ? 'border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-brand-accent'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••"
                  className={`w-full pl-10 p-3 bg-gray-50 border rounded-lg outline-none transition ${
                    errors.password ? 'border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-brand-accent'
                  }`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg hover:bg-black transition flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
