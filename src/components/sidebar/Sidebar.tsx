import { Users, ClipboardList, CarFront, LayoutDashboard, Settings, LogOut, Boxes, Tag, PanelLeft, PanelLeftClose } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useEffect, useState } from 'react';

const NavItem = ({ to, icon, label, isMenuSmall }: { to: string; icon: React.ReactNode; label: string; isMenuSmall: boolean }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center ${!isMenuSmall && 'gap-3'} p-3 rounded-lg transition-all duration-200
      ${isActive
        ? 'bg-brand-accent text-white shadow-lg shadow-orange-900/20'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
    `}
  >
    {icon}
    {!isMenuSmall && <span className="font-medium">{label}</span>}
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
  const [isMenuSmall, setIsMenuSmall] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const hiddenMenu = () => {
    setIsMenuSmall(!isMenuSmall);
  }

  useEffect(() => {
    window.addEventListener('resize', () => {
      setIsMenuSmall(window.innerWidth < 1368);
    });
  }, []);

  return (
    <aside className={`transition-all ease-linear bg-brand-dark text-white py-6 flex flex-col items-center h-screen sticky top-0 ${isMenuSmall ? 'w-30 min-w-30 px-4' : 'w-64 min-w-64 px-6'}`}>

      {/* Logo */}
      <div className={`mb-6 w-full ${isMenuSmall ? 'text-center' : 'flex justify-between items-center'} transition-discrete`}>
        {
          !isMenuSmall &&
          <h1 className="text-xl font-bold text-brand-accent flex items-center gap-2">
            <CarFront className="hover:animate-pulse" />
            {isMenuSmall ? '' : 'TALLER NOW' }
          </h1>
        }
        <button onClick={hiddenMenu} className='text-center'>
          {isMenuSmall ?  <PanelLeft size={20} />  : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col flex-1 gap-1 overflow-y-auto">

        {/* Operaciones */}
        { isMenuSmall ? <hr className='text-gray-400 mb-6 w-full' /> : <SectionLabel label="Operaciones" /> }
        <NavItem to="/" icon={<LayoutDashboard size={20} className={`${isMenuSmall ? 'mx-auto' : ''}`} />} label={'Dashboard'} isMenuSmall={isMenuSmall} />
        <NavItem to="/orders" icon={<ClipboardList size={20} className={`${isMenuSmall ? 'mx-auto' : ''}`} />} label={'Ordenes'} isMenuSmall={isMenuSmall} />
        <NavItem to="/customers" icon={<Users size={20} className={`${isMenuSmall ? 'mx-auto' : ''}`} />} label={'Clientes'} isMenuSmall={isMenuSmall} />

        {/* Catálogo */}
        { isMenuSmall ? <hr className='text-gray-400 my-6 w-full' /> : <SectionLabel label="Catálogo" /> }
        <NavItem to="/supplies" icon={<Boxes size={20} className={`${isMenuSmall ? 'mx-auto' : ''}`} />} label={'Suministros'} isMenuSmall={isMenuSmall} />
        <NavItem to="/types-services" icon={<Tag size={20} className={`${isMenuSmall ? 'mx-auto' : ''}`} />} label={'Tipos de Servicio'} isMenuSmall={isMenuSmall} />

      </nav>

      {/* Footer */}
      <div className="pt-6 flex flex-col gap-1">
        { isMenuSmall ? <hr className='text-gray-400 mb-6 w-full' /> : <SectionLabel label="Sistema" /> }
        <NavItem to="/settings" icon={<Settings size={20} className={`${isMenuSmall ? 'mx-auto' : ''}`} />} label="Configuración" isMenuSmall={isMenuSmall} />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors w-full mt-2"
        >
          <LogOut size={20} />
          {isMenuSmall ? null : <span className="font-medium">Cerrar Sesión</span>}
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
