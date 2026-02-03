import {  Users, ClipboardList, Package, CarFront, LayoutDashboard } from 'lucide-react';

const App = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-white p-6 flex flex-col gap-8">
        <h1 className="text-2xl font-bold italic text-brand-accent">TALLER PRO</h1>

        <nav className="flex flex-col gap-4">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<ClipboardList size={20}/>} label="Servicios" />
          <NavItem icon={<CarFront size={20}/>} label="Vehículos" />
          <NavItem icon={<Users size={20}/>} label="Clientes" />
          <NavItem icon={<Package size={20}/>} label="Inventario" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Panel General</h2>
          <p className="text-gray-500">Bienvenido al sistema de gestión de tu taller.</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="En taller" value="12" sub="8 Carros / 4 Motos" />
          <StatCard title="Citas Hoy" value="5" sub="Próxima a las 2:00 PM" />
          <StatCard title="Alertas Stock" value="3" color="text-red-500" />
        </div>
      </main>
    </div>
  );
};

// Sub-componentes rápidos para mantener el código limpio
const NavItem = ({ icon, label, active = false }: any) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${active ? 'bg-brand-accent text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

const StatCard = ({ title, value, sub, color = "text-brand-accent" }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-gray-400 text-sm font-semibold uppercase">{title}</h3>
    <p className={`text-4xl font-bold my-2 ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-500">{sub}</p>}
  </div>
);

export default App;
