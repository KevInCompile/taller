import { CarFront, ClipboardList, Package, TrendingUp, Users } from "lucide-react";

const Feature = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-brand-accent">
      {icon}
    </div>
    <p className="text-sm text-gray-300 font-medium">{text}</p>
  </div>
);


const SideLeft: React.FC = () => {
  return (
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
  )
};

export default SideLeft
