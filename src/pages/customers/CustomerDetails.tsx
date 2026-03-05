import { Car, Phone, Mail, MapPin, Plus, Trash2, Loader2 } from 'lucide-react';
import { useCustomerById } from '../../hooks/useCustomerById';
import { CustomerDetailSkeleton } from '../../components/customers/skeletons/SkeletonCustomerDetail';
import { VehicleModal } from '../../components/vehicles/VehicleModal';
import { useState } from 'react';
import { useDeleteVehicle } from '../../hooks/useDeleteVehicle';

export const CustomerDetail = () => {
  const { customer, loading, refresh } = useCustomerById();
  const { confirmId, deleting, requestDelete, cancelDelete, confirmDelete } = useDeleteVehicle(refresh);
  const [dataVehicleModal, setDataVehicleModal] = useState({
    open: false,
    id: '',
    name: ''
  });

  const handleOpenVehicleModal = (id: string, name: string) => {
    setDataVehicleModal({ open: true, id, name });
  };

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
              <button onClick={() => handleOpenVehicleModal(customer.id, customer.firstName)} className="text-brand-accent hover:bg-orange-50 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 transition">
                <Plus size={16} /> Agregar Vehículo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.vehicles.map(vehicle => (
                <div key={vehicle.id} className="border border-gray-100 rounded-xl p-4 hover:border-brand-accent transition-colors group relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-brand-dark text-white px-2 py-1 rounded text-xs font-bold uppercase">
                      {vehicle.plate}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => requestDelete(vehicle.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-0.5"
                        title="Eliminar vehículo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-800 uppercase">{vehicle.brand} {vehicle.model}</h4>
                  <p className="text-xs text-gray-400 font-medium">{vehicle.year} • {vehicle.color} • {vehicle.mileage} KM</p>

                  {/* Confirmación inline */}
                  {confirmId === vehicle.id && (
                    <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center gap-3 border border-red-200 animate-fadeIn">
                      <p className="text-sm font-semibold text-gray-700 text-center px-4">
                        ¿Eliminar <span className="text-red-500">{vehicle.plate}</span>?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={cancelDelete}
                          disabled={deleting}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={confirmDelete}
                          disabled={deleting}
                          className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-70 flex items-center gap-1.5 transition-colors"
                        >
                          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Aquí irían las Órdenes de Trabajo recientes */}
        </div>
      </div>
      <VehicleModal
        isOpen={dataVehicleModal.open}
        customerId={dataVehicleModal.id}
        customerName={dataVehicleModal.name}
        onSuccess={refresh}
        onClose={() => setDataVehicleModal({ ...dataVehicleModal, open: false })}
      />
    </div>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <div className="flex items-center gap-3 text-sm">
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-gray-400 text-[10px] uppercase font-bold leading-none">{label}</p>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  </div>
);
