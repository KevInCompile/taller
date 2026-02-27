  import { useMemo, useState, useEffect } from 'react';
import { useCustomers } from '../../hooks/useCustomers';
import { Plus, Search, UserPlus, Loader2, Users, X, Pencil, Trash2 } from 'lucide-react';
import { customerService } from '../../api/customer.service';
import type { Customer } from '../../models/customer.model';
import Swal from 'sweetalert2';
import { CustomerModal } from '../../components/customers/CustomerModal';
import { VehicleModal } from '../../components/vehicles/VehicleModal';
import { Link } from 'react-router-dom';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../../components/ui/Pagination';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

export const CustomersPage = () => {
  const { customers, loading, refresh } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleModal, setVehicleModal] = useState({ open: false, id: '', name: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleOpenVehicle = (id: string, name: string) => {
    setVehicleModal({ open: true, id, name });
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleDelete = async (customer: Customer) => {
    const result = await Swal.fire({
      title: '¿Eliminar cliente?',
      html: `Esta acción eliminará a <strong>${customer.firstName} ${customer.lastName}</strong> y todos sus datos asociados.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#1F2937',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await customerService.delete(customer.id);
        refresh();
        toast.success("Cliente eliminado correctamente.")
      } catch {
        toast.error("No se pudo eliminar el cliente. Intenta nuevamente.")
      }
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;

    const lowerTerm = searchTerm.toLowerCase();

    return customers.filter((customer) => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      const phone = customer.phone.toLowerCase();
      const email = customer.email.toLowerCase();

      const hasMatchingVehicle = customer.vehicles.some((v) =>
        v.plate.toLowerCase().includes(lowerTerm)
      );

      return (
        fullName.includes(lowerTerm) ||
        phone.includes(lowerTerm) ||
        email.includes(lowerTerm) ||
        hasMatchingVehicle
      );
    });
  }, [searchTerm, customers]);

  const { resetPage, ...pagination } = usePagination({
    totalItems: filteredCustomers.length,
    itemsPerPage: PAGE_SIZE,
  });

  useEffect(() => {
    resetPage();
  }, [searchTerm, resetPage]);

  const paginatedCustomers = useMemo(
    () => filteredCustomers.slice(pagination.offset, pagination.offset + PAGE_SIZE),
    [filteredCustomers, pagination.offset]
  );

  return (
    <div className="space-y-6 animate-fadeIn p-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-500 text-sm">Base de datos de propietarios y vehículos.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-accent text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <UserPlus size={20} /> Nuevo Cliente
        </button>
      </header>

      {/* Buscador */}
      <div className="relative group">
        <Search
          className={`absolute left-3 top-3 transition-colors ${searchTerm ? 'text-brand-accent' : 'text-gray-400'}`}
          size={20}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, teléfono, email o placa (ABC-123)..."
          className="w-full pl-10 pr-10 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none transition-all shadow-sm group-hover:border-gray-300"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Contenedor de Tabla / Loading */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-100 text-gray-400">
            <Loader2 className="animate-spin mb-4 text-brand-accent" size={40} />
            <p className="font-medium animate-pulse">Consultando datos</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 text-center p-6">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <Users size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">No hay clientes aún</h3>
            <p className="text-gray-500 max-w-xs mt-1">
              Registra a tu primer cliente para empezar a gestionar sus vehículos.
            </p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 text-center p-6">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <Search size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Sin resultados</h3>
            <p className="text-gray-500 max-w-xs mt-1">
              No se encontraron clientes que coincidan con "{searchTerm}".
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Contacto</th>
                    <th className="px-6 py-4">Vehículos</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <Link
                          to={`/customer/${customer.id}`}
                          className="font-bold text-gray-800 hover:text-brand-accent transition-colors"
                        >
                          {customer.firstName} {customer.lastName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-gray-700">{customer.phone}</div>
                        <div className="text-gray-400 text-xs">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {customer.vehicles.length > 0 ? (
                            customer.vehicles.map((v) => (
                              <span
                                key={v.id}
                                className="bg-orange-50 text-brand-accent text-[10px] px-2 py-0.5 rounded border border-orange-100 font-bold uppercase"
                              >
                                {v.plate}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-300 text-xs italic">0 vehículos</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenVehicle(customer.id, `${customer.firstName} ${customer.lastName}`)}
                            className="text-gray-400 hover:text-brand-accent transition-colors p-2 rounded-lg hover:bg-orange-50"
                            title="Agregar vehículo"
                          >
                            <Plus size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(customer)}
                            className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-50"
                            title="Editar cliente"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(customer)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                            title="Eliminar cliente"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="px-6 py-4 border-t border-gray-100">
              <Pagination
                {...pagination}
                totalItems={filteredCustomers.length}
                itemsPerPage={PAGE_SIZE}
                tableName='clientes'
              />
            </div>
          </div>
        )}
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={refresh}
        onOpenVehicleModal={handleOpenVehicle}
        customer={selectedCustomer ?? undefined}
      />
      <VehicleModal
        isOpen={vehicleModal.open}
        customerId={vehicleModal.id}
        customerName={vehicleModal.name}
        onClose={() => setVehicleModal({ ...vehicleModal, open: false })}
        onSuccess={refresh}
      />
    </div>
  );
};
