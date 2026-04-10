import { AlertCircle, ArrowUpDown, ClipboardList, Eye, Filter, Loader2, Pencil, Plus, RefreshCw, Search, Trash2, Wrench, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react";
import type { WorkOrder, WorkOrderPriority, WorkOrderStatus } from "../../../models/work-order.model";
import { InvoiceModal } from "../../../components/orders/invoice/InvoiceModal";
import { Pagination } from "../../../components/ui/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { PRIORITY_BORDER, PRIORITY_OPTIONS, STATUS_OPTIONS } from "../../../models/work-order.constants";
import { formatCurrency, formatDate, shortId } from "../../../helpers/helpers";
import { PriorityBadge, StatusBadge } from "../../../components/orders/WorkOrderBadges";
import { handleDelete } from "../handlers/delete";
import { handleChangeStatus } from "../handlers/change-status";

interface Props {
  workOrders: WorkOrder[];
  loading: boolean;
  refresh: () => Promise<void>;
  setIsModalOpen: (isOpen: boolean) => void;
  setSelectedOrder: React.Dispatch<React.SetStateAction<WorkOrder | null>>
}

const PAGE_SIZE = 10;

export const TableOrders: React.FC<Props> = (props) => {
  const {workOrders, loading, refresh, setIsModalOpen, setSelectedOrder} = props
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<WorkOrder | null>(null);

  // Filters
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return workOrders.filter(order => {
      // Status filter
      if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
      // Priority filter
      if (priorityFilter !== 'ALL' && order.priority !== priorityFilter) return false;
      // Search
      if (term) {
        const customerName = order.customer
          ? `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase()
          : '';
        const plate = order.vehicle?.plate?.toLowerCase() ?? '';
        const mechanic = order.mechanic?.toLowerCase() ?? '';
        const service = order.service?.name?.toLowerCase() ?? '';
        const id = order.id.toLowerCase();

        if (
          !customerName.includes(term) &&
          !plate.includes(term) &&
          !mechanic.includes(term) &&
          !service.includes(term) &&
          !id.includes(term)
        ) return false;
      }
      return true;
    });
  }, [workOrders, searchTerm, statusFilter, priorityFilter]);

  // Pagination
  const { resetPage, ...pagination } = usePagination({
    totalItems:   filtered.length,
    itemsPerPage: PAGE_SIZE,
  });

  useEffect(() => {
    resetPage()
  }, [searchTerm, statusFilter, priorityFilter, resetPage]);

  const paginated = useMemo(
    () => filtered.slice(pagination.offset, pagination.offset + PAGE_SIZE),
    [filtered, pagination.offset],
  );

  const hasActiveFilters = statusFilter !== 'ALL' || priorityFilter !== 'ALL' || searchTerm;

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
  };

  const handleEdit = (order: WorkOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };


  return (
    <>
    {/* Filters */}
    <div className="flex flex-wrap gap-3 items-center">

      {/* Search */}
      <div className="relative flex-1 min-w-64 group">
        <Search
          className={`absolute left-3 top-3 transition-colors ${searchTerm ? 'text-brand-accent' : 'text-gray-400'}`}
          size={18}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar por cliente, placa, mecánico, servicio..."
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

      {/* Status filter */}
      <div className="relative">
        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as WorkOrderStatus | 'ALL')}
          className="pl-8 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl outline-none transition-all shadow-sm text-sm appearance-none focus:ring-2 focus:ring-brand-accent cursor-pointer"
        >
          <option value="ALL">Todos los estados</option>
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Priority filter */}
      <div className="relative">
        <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value as WorkOrderPriority | 'ALL')}
          className="pl-8 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl outline-none transition-all shadow-sm text-sm appearance-none focus:ring-2 focus:ring-brand-accent cursor-pointer"
        >
          <option value="ALL">Todas las prioridades</option>
          {PRIORITY_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2.5 rounded-xl hover:bg-red-50 border border-gray-200"
        >
          <X size={14} /> Limpiar
        </button>
      )}
    </div>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-100">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-100 text-gray-400">
          <Loader2 className="animate-spin mb-4 text-brand-accent" size={40} />
          <p className="font-medium animate-pulse">Cargando órdenes de trabajo...</p>
        </div>

      ) : workOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-100 text-center p-8">
          <div className="bg-gray-50 p-6 rounded-full mb-4">
            <ClipboardList size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">No hay órdenes aún</h3>
          <p className="text-gray-500 max-w-xs mt-1 text-sm">
            Crea tu primera orden de trabajo para comenzar a gestionar los servicios del taller.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-brand-accent text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} /> Crear Primera Orden
          </button>
        </div>

      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-100 text-center p-8">
          <div className="bg-gray-50 p-6 rounded-full mb-4">
            <AlertCircle size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">Sin resultados</h3>
          <p className="text-gray-500 max-w-xs mt-1 text-sm">
            No se encontraron órdenes con los filtros aplicados.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 flex items-center gap-1.5 text-sm text-brand-accent hover:underline font-semibold"
          >
            <RefreshCw size={14} /> Limpiar filtros
          </button>
        </div>

      ) : (
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Orden</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Vehículo</th>
                  <th className="px-6 py-4">Servicio / Mecánico</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Prioridad</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map(order => (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 transition-colors group border-l-4 ${PRIORITY_BORDER[order.priority] ?? 'border-l-gray-200'}`}
                  >
                    {/* Orden */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800 font-mono text-sm">
                        #{shortId(order.id)}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {formatDate(order.startDate)}
                      </p>
                    </td>

                    {/* Cliente */}
                    <td className="px-6 py-4">
                      {order.customer ? (
                        <>
                          <p className="font-semibold text-gray-800 text-sm">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{order.customer.phone}</p>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Sin cliente</span>
                      )}
                    </td>

                    {/* Vehículo */}
                    <td className="px-6 py-4">
                      {order.vehicle ? (
                        <>
                          <span className="bg-orange-50 text-brand-accent text-[10px] px-2 py-0.5 rounded border border-orange-100 font-bold uppercase inline-block">
                            {order.vehicle.plate}
                          </span>
                          <p className="text-[11px] text-gray-500 mt-1 font-medium">
                            {order.vehicle.brand} {order.vehicle.model} · {order.vehicle.year}
                          </p>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Sin vehículo</span>
                      )}
                    </td>

                    {/* Servicio / Mecánico */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800 text-sm">
                        {order.service?.name ?? '—'}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <Wrench size={10} /> {order.mechanic}
                      </p>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Prioridad */}
                    <td className="px-6 py-4">
                      <PriorityBadge priority={order.priority} />
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-gray-800 text-sm tabular-nums">
                        {formatCurrency(order.total)}
                      </p>
                      {order.subtotal !== order.total && (
                        <p className="text-[10px] text-gray-400 mt-0.5 tabular-nums">
                          sub: {formatCurrency(order.subtotal)}
                        </p>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrderDetails(order)}
                          className="text-gray-400 hover:text-green-500 transition-colors p-2 rounded-lg hover:bg-green-50"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleChangeStatus(order, refresh)}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-50"
                          title="Cambiar estado"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(order)}
                          className="text-gray-400 hover:text-brand-accent transition-colors p-2 rounded-lg hover:bg-orange-50"
                          title="Editar orden"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(order, refresh)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                          title="Eliminar orden"
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
              tableName="órdenes"
            />
          </div>
        </div>
      )}

      <InvoiceModal
        isOpen={!!selectedOrderDetails}
        onClose={() => setSelectedOrderDetails(null)}
        workOrder={selectedOrderDetails}
      />
      </div>
    </>
  )
}
