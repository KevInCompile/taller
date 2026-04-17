import { useMemo, useState, useEffect } from 'react';
import {
  Package, Search, Plus, Loader2, X, Pencil,
  Trash2, AlertTriangle, CheckCircle2, XCircle,
} from 'lucide-react';
import { useSupplies } from './hooks/useSupplies';
import { suppliesApiService } from '../../api/supplies.service';
import { SupplyModal } from './ui/modals/SupplyModal';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../../components/ui/Pagination';
import type { Supply } from '../orders/schemas/work-order.model';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { formatCurrency } from '../../helpers/helpers';
import StatCard from '../orders/ui/StatCard';
import { Header } from '../../components/ui/Header';

const PAGE_SIZE = 10;

type StockLevel = 'out' | 'low' | 'ok';

const getStockLevel = (stock: number): StockLevel => {
  if (stock === 0) return 'out';
  if (stock < 5)   return 'low';
  return 'ok';
};

const StockBadge = ({ stock }: { stock: number }) => {
  const level = getStockLevel(stock);

  if (level === 'out') return (
    <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-xs px-2.5 py-1 rounded-full font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
      Sin stock
    </span>
  );

  if (level === 'low') return (
    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
      {stock} unidades
    </span>
  );

  return (
    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs px-2.5 py-1 rounded-full font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
      {stock} unidades
    </span>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

type StockFilter = 'ALL' | 'out' | 'low' | 'ok';

export const SuppliesPage = () => {
  const { supplies, loading, refresh } = useSupplies();
  const [isModalOpen,    setIsModalOpen]    = useState(false);
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
  const [searchTerm,     setSearchTerm]     = useState('');
  const [stockFilter,    setStockFilter]    = useState<StockFilter>('ALL');

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:   supplies.length,
    out:     supplies.filter(s => s.stock === 0).length,
    low:     supplies.filter(s => s.stock > 0 && s.stock < 5).length,
    ok:      supplies.filter(s => s.stock >= 5).length,
  }), [supplies]);

  // ── Filters ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return supplies.filter(supply => {
      if (stockFilter !== 'ALL' && getStockLevel(supply.stock) !== stockFilter) return false;
      if (term) {
        return (
          supply.name.toLowerCase().includes(term) ||
          supply.description?.toLowerCase().includes(term) ||
          String(supply.price).includes(term)
        );
      }
      return true;
    });
  }, [supplies, searchTerm, stockFilter]);

  // ── Paginatio
  const { resetPage, ...pagination } = usePagination({
    totalItems:   filtered.length,
    itemsPerPage: PAGE_SIZE,
  });

  useEffect(() => { resetPage(); }, [searchTerm, stockFilter, resetPage]);

  const paginated = useMemo(
    () => filtered.slice(pagination.offset, pagination.offset + PAGE_SIZE),
    [filtered, pagination.offset],
  );

  // ── Handlers
  const handleEdit = (supply: Supply) => {
    setSelectedSupply(supply);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSupply(null);
  };

  const handleDelete = async (supply: Supply) => {
    const result = await Swal.fire({
      title: '¿Eliminar suministro?',
      html: `Esta acción eliminará <strong>"${supply.name}"</strong> del inventario. No se puede deshacer.`,
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
        await suppliesApiService.delete(supply.id);
        refresh();
        toast.success(`"${supply.name}" eliminado del inventario`);
      } catch {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el suministro. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#F2633C',
        });
      }
    }
  };

  const toggleStockFilter = (level: StockFilter) => {
    setStockFilter(prev => prev === level ? 'ALL' : level);
  };

  const hasActiveFilters = stockFilter !== 'ALL' || searchTerm;

  const clearFilters = () => {
    setSearchTerm('');
    setStockFilter('ALL');
  };

  // ── Render
  return (
    <div className="space-y-6 animate-fadeIn p-8">

      {/* Header */}
      <Header
        title="Suministros"
        textButton="Nuevo suministro"
        actionButton={() => setIsModalOpen(true)}
        iconButton={<Plus size={18} />}
      >
        <p className="text-gray-500 text-sm">Gestiona el inventario de repuestos y materiales.</p>
      </Header>

      {/* Stats — clickable to filter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Suministros"
          value={stats.total}
          icon={<Package size={20} />}
          accent="text-gray-600"
          bg="bg-gray-100"
        />
        <StatCard
          label="Sin Stock"
          value={stats.out}
          icon={<XCircle size={20} />}
          accent="text-red-500"
          bg="bg-red-50"
          active={stockFilter === 'out'}
          onClick={() => toggleStockFilter('out')}
        />
        <StatCard
          label="Stock Bajo"
          value={stats.low}
          icon={<AlertTriangle size={20} />}
          accent="text-amber-600"
          bg="bg-amber-50"
          active={stockFilter === 'low'}
          onClick={() => toggleStockFilter('low')}
        />
        <StatCard
          label="Disponibles"
          value={stats.ok}
          icon={<CheckCircle2 size={20} />}
          accent="text-green-600"
          bg="bg-green-50"
          active={stockFilter === 'ok'}
          onClick={() => toggleStockFilter('ok')}
        />
      </div>

      {/* Search & filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-64 group">
          <Search
            className={`absolute left-3 top-3 transition-colors ${searchTerm ? 'text-brand-accent' : 'text-gray-400'}`}
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, descripción o precio..."
            className="text-foreground w-full pl-9 pr-9 py-2.5 bg-elements border border-border-elements rounded-xl focus:ring-2 focus:ring-brand-accent outline-none transition-all shadow-sm text-sm group-hover:border-gray-300"
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

        {stockFilter !== 'ALL' && (
          <div className="flex items-center gap-2 bg-brand-accent/10 text-brand-accent text-sm font-semibold px-3 py-2 rounded-xl border border-orange-200">
            <span>
              {stockFilter === 'out' ? '🔴 Sin stock' :
               stockFilter === 'low' ? '🟡 Stock bajo' :
               '🟢 Disponibles'}
            </span>
            <button onClick={() => setStockFilter('ALL')} className="hover:text-orange-700">
              <X size={14} />
            </button>
          </div>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2.5 rounded-xl hover:bg-red-50 border border-gray-200"
          >
            <X size={14} /> Limpiar
          </button>
        )}
      </div>

      {/* Table container */}
      <div className="bg-elements rounded-2xl border border-border-elements shadow-sm overflow-hidden min-h-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-100 text-gray-400">
            <Loader2 className="animate-spin mb-4 text-brand-accent" size={40} />
            <p className="font-medium animate-pulse">Cargando suministros...</p>
          </div>

        ) : supplies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 text-center p-8">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <Package size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No hay suministros registrados</h3>
            <p className="text-gray-500 max-w-xs mt-1 text-sm">
              Agrega repuestos, aceites, filtros y demás materiales al inventario del taller.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-brand-accent text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-orange-600 transition-colors"
            >
              <Plus size={16} /> Agregar Primer Suministro
            </button>
          </div>

        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 text-center p-8">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <Search size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Sin resultados</h3>
            <p className="text-gray-500 max-w-xs mt-1 text-sm">
              No se encontraron suministros con los filtros aplicados.
            </p>
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-brand-accent font-semibold hover:underline"
            >
              Limpiar filtros
            </button>
          </div>

        ) : (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-border-elements">
                  <tr>
                    <th className="px-6 py-4">Suministro</th>
                    <th className="px-6 py-4">Descripción</th>
                    <th className="px-6 py-4 text-right">Precio Unit.</th>
                    <th className="px-6 py-4 text-center">Stock</th>
                    <th className="px-6 py-4 text-right">Valor en Stock</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-elements">
                  {paginated.map(supply => {
                    const level      = getStockLevel(supply.stock);
                    const totalValue = Number(supply.price) * supply.stock;

                    return (
                      <tr
                        key={supply.id}
                        className={`hover:bg-gray-50 transition-colors group border-l-4 ${
                          level === 'out' ? 'border-l-red-400' :
                          level === 'low' ? 'border-l-amber-400' :
                          'border-l-green-400'
                        }`}
                      >
                        {/* Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg shrink-0 ${
                              level === 'out' ? 'bg-red-50' :
                              level === 'low' ? 'bg-amber-50' :
                              'bg-green-50'
                            }`}>
                              <Package
                                size={16}
                                className={
                                  level === 'out' ? 'text-red-400' :
                                  level === 'low' ? 'text-amber-500' :
                                  'text-green-500'
                                }
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground text-sm">{supply.name}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                                #{supply.id.slice(-6).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm text-gray-600 truncate" title={supply.description}>
                            {supply.description || <span className="text-gray-300 italic">Sin descripción</span>}
                          </p>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 text-right">
                          <p className="font-bold text-foreground text-sm tabular-nums">
                            {formatCurrency(supply.price)}
                          </p>
                        </td>

                        {/* Stock badge */}
                        <td className="px-6 py-4 text-center">
                          <StockBadge stock={supply.stock} />
                        </td>

                        {/* Total value */}
                        <td className="px-6 py-4 text-right">
                          {supply.stock > 0 ? (
                            <p className="font-semibold text-foreground text-sm tabular-nums">
                              {formatCurrency(totalValue)}
                            </p>
                          ) : (
                            <span className="text-gray-300 text-sm">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(supply)}
                              className="text-gray-400 hover:text-brand-accent transition-colors p-2 rounded-lg hover:bg-orange-50"
                              title="Editar suministro"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(supply)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                              title="Eliminar suministro"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-border-elements">
              <Pagination
                {...pagination}
                totalItems={filtered.length}
                itemsPerPage={PAGE_SIZE}
                tableName="suministros"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <SupplyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={refresh}
        supply={selectedSupply ?? undefined}
      />
    </div>
  );
};
