import {
  Users,
  ClipboardList,
  Package,
  CarFront,
  LayoutDashboard,
  Settings,
  LogOut
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 p-3 rounded-lg transition-all duration-200
      ${isActive
        ? 'bg-brand-accent text-white shadow-lg shadow-orange-900/20'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
    `}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-brand-dark text-white p-6 flex flex-col h-screen sticky top-0">
      <div className="mb-10">
        <h1 className="text-2xl font-bold  text-brand-accent flex items-center gap-2">
          <CarFront className="animate-pulse" /> TALLER NOW
        </h1>
      </div>

      {/* Sección Principal de Operaciones */}
      <nav className="flex flex-col gap-2 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 ml-2">Menú Principal</p>
        <NavItem to="/" icon={<LayoutDashboard size={20}/>} label="Dashboard" />
        <NavItem to="/servicios" icon={<ClipboardList size={20}/>} label="Servicios" />
        <NavItem to="/vehiculos" icon={<CarFront size={20}/>} label="Vehículos" />
        <NavItem to="/customers" icon={<Users size={20}/>} label="Clientes" />
        <NavItem to="/inventario" icon={<Package size={20}/>} label="Inventario" />
      </nav>

      {/* Sección Inferior de Configuración y Cuenta */}
      <div className="pt-6 border-t border-gray-800 flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 ml-2">Sistema</p>
        <NavItem to="/settings" icon={<Settings size={20}/>} label="Configuración" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors w-full mt-2"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
