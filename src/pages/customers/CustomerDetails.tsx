import { Car, Phone, Mail, MapPin, Plus, ClipboardList } from 'lucide-react';
import { useCustomerById } from '../../hooks/useCustomerById';
import { CustomerDetailSkeleton } from '../../components/customers/skeletons/SkeletonCustomerDetail';
import { VehicleModal } from '../../components/vehicles/VehicleModal';
import { useState } from 'react';
import { useDeleteVehicle } from '../../hooks/useDeleteVehicle';
import { DetailItem } from '../../components/customers/detail/DetailItem';
import { VehicleCard } from '../../components/customers/detail/VehicleCard';
import { WorkOrderCard } from '../../components/customers/detail/WorkOrderCard';
import { EmptyState } from '../../components/ui/EmptyState';

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

  if (loading) return <CustomerDetailSkeleton />;

  return (
    <div className="space-y-6 animate-fadeIn p-8">
      <button 
        onClick={() => window.history.back()} 
        className="text-gray-500 hover:text-brand-accent flex items-center gap-2 text-sm font-medium"
      >
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
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold mt-1">
              Cliente Activo
            </span>
          </div>

          <div className="space-y-4">
            <DetailItem icon={<Phone size={18} />} label="Teléfono" value={customer.phone} />
            <DetailItem icon={<Mail size={18} />} label="Email" value={customer.email} />
            <DetailItem icon={<MapPin size={18} />} label="Dirección" value={customer.address || 'No registrada'} />
          </div>
        </div>

        {/* COLUMNA VEHÍCULOS Y ÓRDENES */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECCIÓN VEHÍCULOS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Car className="text-brand-accent" /> Garaje del Cliente
              </h3>
              <button
                onClick={() => handleOpenVehicleModal(customer.id, customer.firstName)}
                className="text-brand-accent hover:bg-orange-50 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 transition"
              >
                <Plus size={16} /> Agregar Vehículo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.vehicles.map(vehicle => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  confirmId={confirmId}
                  deleting={deleting}
                  onRequestDelete={requestDelete}
                  onCancelDelete={cancelDelete}
                  onConfirmDelete={confirmDelete}
                />
              ))}
            </div>
          </div>

          {/* SECCIÓN ÓRDENES DE TRABAJO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ClipboardList className="text-brand-accent" /> Órdenes de Trabajo
              </h3>
              <span className="text-sm text-gray-500 font-medium">
                {customer.workOrders?.length || 0} órdenes
              </span>
            </div>

            {customer.workOrders && customer.workOrders.length > 0 ? (
              <div className="space-y-4">
                {customer.workOrders.map(order => (
                  <WorkOrderCard key={order.id} order={order} vehicles={customer.vehicles} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<ClipboardList size={48} className="mx-auto opacity-30" />}
                title="No hay órdenes de trabajo registradas"
                description="Este cliente aún no tiene órdenes de trabajo"
              />
            )}
          </div>
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