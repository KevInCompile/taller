import {  useEffect, useState} from 'react';
import { Plus } from 'lucide-react';
import { useWorkOrders } from './hooks/useWorkOrders';
import { WorkOrderModal } from './ui/modals/WorkOrderModal';
import type {  WorkOrder } from './schemas/work-order.model';
import Stats from './ui/Stats';
import { TableOrders } from './ui/TableOrders';
import { Header } from '../../components/ui/Header';

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
      <Header title="Órdenes de Trabajo" textButton="Nueva Orden" actionButton={() => setIsModalOpen(true)} iconButton={<Plus size={18} />}>
        <p className="text-gray-500 text-sm">Gestiona los servicios activos del taller.</p>
      </Header>
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
