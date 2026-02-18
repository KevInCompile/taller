import { Car, Phone, Mail, MapPin, Plus, History } from 'lucide-react';
import { useCustomerById } from '../hooks/useCustomerById';
import { CustomerDetailSkeleton } from '../components/customers/skeletons/SkeletonCustomerDetail';

export const CustomerDetail = () => {
  const { customer, loading } = useCustomerById();
  if (loading) return (
    <CustomerDetailSkeleton />
  );

  return (
    <div className="space-y-6 animate-fadeIn p-8">
      <button onClick={() => window.history.back()} className="text-gray-500 hover:text-brand-accent flex items-center gap-2 text-sm font-medium">
        ← Volver a Clientes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA PERFIL */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-orange-100 text-brand-accent rounded-full flex items-center justify-center text-3xl font-bold mb-3">
              {customer.firstName[0]}{customer.lastName[0]}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{customer.firstName} {customer.lastName}</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold mt-1">Cliente Activo</span>
          </div>

          <div className="space-y-4">
            <DetailItem icon={<Phone size={18}/>} label="Teléfono" value={customer.phone} />
            <DetailItem icon={<Mail size={18}/>} label="Email" value={customer.email} />
            <DetailItem icon={<MapPin size={18}/>} label="Dirección" value={customer.address || 'No registrada'} />
          </div>
        </div>

        {/* COLUMNA VEHÍCULOS (GARAJE) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Car className="text-brand-accent" /> Garaje del Cliente
              </h3>
              <button className="text-brand-accent hover:bg-orange-50 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 transition">
                <Plus size={16} /> Agregar Vehículo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.vehicles.map(vehicle => (
                <div key={vehicle.id} className="border border-gray-100 rounded-xl p-4 hover:border-brand-accent transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-brand-dark text-white px-2 py-1 rounded text-xs font-bold uppercase">
                      {vehicle.plate}
                    </span>
                    <History size={18} className="text-gray-300 group-hover:text-brand-accent" />
                  </div>
                  <h4 className="font-bold text-gray-800 uppercase">{vehicle.brand} {vehicle.model}</h4>
                  <p className="text-xs text-gray-400 font-medium">{vehicle.year} • {vehicle.color} • {vehicle.mileage} KM</p>
                </div>
              ))}
            </div>
          </div>

          {/* Aquí irían las Órdenes de Trabajo recientes */}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-3 text-sm">
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-gray-400 text-[10px] uppercase font-bold leading-none">{label}</p>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  </div>
);
