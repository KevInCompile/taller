import { useMemo, useState, useEffect } from 'react';
import {
  ClipboardList, Search, Plus, Loader2, X,
  Pencil, Trash2
} from 'lucide-react';
import { useServices } from './hooks/useTypesServices';
import { servicesCatalogService } from '../../api/services-catalog.service';
import { ServiceModal } from './ui/modals/ServiceModal';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../../components/ui/Pagination';
import type { Service } from '../orders/schemas/work-order.model';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { formatDate } from '../../helpers/helpers';

const PAGE_SIZE = 10;

export const ServicesPage = () => {
  const { services, loading, refresh } = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return services;
    return services.filter(s => s.name.toLowerCase().includes(term));
  }, [services, searchTerm]);

  // Pagination
  const { resetPage, ...pagination } = usePagination({
    totalItems:   filtered.length,
    itemsPerPage: PAGE_SIZE,
  });

  useEffect(() => { resetPage(); }, [searchTerm, resetPage]);

  const paginated = useMemo(
    () => filtered.slice(pagination.offset, pagination.offset + PAGE_SIZE),
    [filtered, pagination.offset],
  );

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleDelete = async (service: Service) => {
    const result = await Swal.fire({
      title: '¿Eliminar tipo de servicio?',
      html: `Esta acción eliminará <strong>"${service.name}"</strong> del catálogo.<br/><span class="text-sm text-gray-500">Las órdenes existentes que usan este servicio no se verán afectadas.</span>`,
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
        await servicesCatalogService.delete(service.id);
        refresh();
        toast.success(`"${service.name}" eliminado del catálogo`);
      } catch {
        toast.error("El servicio no se elimino!")
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn p-8">

      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tipos de Servicio</h1>
          <p className="text-gray-500 text-sm">
            Catálogo de servicios disponibles en el taller.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-accent text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100 font-semibold"
        >
          <Plus size={20} /> Nuevo Servicio
        </button>
      </header>

      {/* Stats bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-dark rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl shrink-0">
            <ClipboardList size={20} className="text-brand-accent" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Uso de servicios</p>
            <p className="text-sm text-white font-medium mt-0.5">
              Usados en órdenes de trabajo
            </p>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="relative group max-w-md">
        <Search
          className={`absolute left-3 top-3 transition-colors ${
            searchTerm ? 'text-brand-accent' : 'text-gray-400'
          }`}
          size={18}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar tipo de servicio..."
          className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none transition-all shadow-sm text-sm group-hover:border-gray-300"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Table container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-100 text-gray-400">
            <Loader2 className="animate-spin mb-4 text-brand-accent" size={40} />
            <p className="font-medium animate-pulse">Cargando catálogo de servicios...</p>
          </div>

        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 text-center p-8">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <ClipboardList size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Sin tipos de servicio</h3>
            <p className="text-gray-500 max-w-xs mt-1 text-sm">
              Define los tipos de servicio que ofrece tu taller para usarlos en las órdenes de trabajo.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-brand-accent text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-orange-600 transition-colors"
            >
              <Plus size={16} /> Crear Primer Servicio
            </button>
          </div>

        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 text-center p-8">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <Search size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Sin resultados</h3>
            <p className="text-gray-500 max-w-xs mt-1 text-sm">
              No se encontró ningún servicio con el nombre{' '}
              <strong>"{searchTerm}"</strong>.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 text-sm text-brand-accent font-semibold hover:underline"
            >
              Limpiar búsqueda
            </button>
          </div>

        ) : (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Tipo de Servicio</th>
                    <th className="px-6 py-4">Fecha de Creación</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((service, index) => (
                    <tr
                      key={service.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm text-brand-accent bg-orange-50"
                          >
                            {service.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {service.name}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Servicio #{(pagination.offset ?? 0) + index + 1}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Created at */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {service.createdAt ? formatDate(service.createdAt) : '—'}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(service)}
                            className="text-gray-400 hover:text-brand-accent transition-colors p-2 rounded-lg hover:bg-orange-50"
                            title="Editar servicio"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(service)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                            title="Eliminar servicio"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100">
              <Pagination
                {...pagination}
                totalItems={filtered.length}
                itemsPerPage={PAGE_SIZE}
                tableName="servicios"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={refresh}
        service={selectedService ?? undefined}
      />
    </div>
  );
};
