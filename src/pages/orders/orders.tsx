import {  useEffect, useState} from 'react';
import { Plus } from 'lucide-react';
import { useWorkOrders } from '../../hooks/useWorkOrders';
import { WorkOrderModal } from '../../components/orders/WorkOrderModal';
import type {  WorkOrder } from '../../models/work-order.model';
import Stats from './ui/Stats';
import { TableOrders } from './ui/TableOrders';

export const OrdersPage = () => {
  const { workOrders, loading, refresh } = useWorkOrders();
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    window.document.title = 'Ordenes de Trabajo'
  }, [])

  return (
    <div className="space-y-6 animate-fadeIn p-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Órdenes de Trabajo</h1>
          <p className="text-gray-500 text-sm">Gestiona los servicios activos del taller.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-accent text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100"
        >
          <Plus size={20} /> Nueva Orden
        </button>
      </header>
      {/* Stat cards */}
      <Stats workOrders={workOrders}/>

      {/* Table container */}
      <TableOrders
        workOrders={workOrders}
        loading={loading}
        refresh={refresh}
        setSelectedOrder={setSelectedOrder}
        setIsModalOpen={setIsModalOpen}
      />

      {/* Modal */}
      <WorkOrderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={refresh}
        workOrder={selectedOrder ?? undefined}
      />
    </div>
  );
};
