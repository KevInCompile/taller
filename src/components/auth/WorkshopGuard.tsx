import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

export const WorkshopGuard = ({ children }: { children: React.ReactNode }) => {
  const workshop = useAuthStore(state => state.workshop);

  if (!workshop) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6">
        <div className="bg-orange-100 p-6 rounded-full mb-4">
          <Store size={48} className="text-brand-accent" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">¡Configura tu taller primero!</h2>
        <p className="text-gray-500 max-w-sm mt-2 mb-6">
          Para gestionar inventarios, clientes y servicios, primero debes registrar los datos de tu negocio.
        </p>
        <Link
          to="/configuracion"
          className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition"
        >
          Configurar Negocio Ahora
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
