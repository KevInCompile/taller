import {
  Users,
  ClipboardList,
  CarFront,
  LayoutDashboard,
  Settings,
  LogOut,
  Boxes,
  Tag,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
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

const SectionLabel = ({ label }: { label: string }) => (
  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-4 mb-1 ml-2 first:mt-0">
    {label}
  </p>
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

      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-accent flex items-center gap-2">
          <CarFront className="animate-pulse" /> TALLER NOW
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex flex-col flex-1 gap-1 overflow-y-auto">

        {/* Operaciones */}
        <SectionLabel label="Operaciones" />
        <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem to="/orders" icon={<ClipboardList size={20} />} label="Ordenes" />
        <NavItem to="/customers" icon={<Users size={20} />} label="Clientes" />

        {/* Catálogo */}
        <SectionLabel label="Catálogo" />
        <NavItem to="/supplies" icon={<Boxes size={20} />} label="Suministros" />
        <NavItem to="/types-service" icon={<Tag size={20} />} label="Tipos de Servicio" />

      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-gray-800 flex flex-col gap-1">
        <SectionLabel label="Sistema" />
        <NavItem to="/settings" icon={<Settings size={20} />} label="Configuración" />

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
