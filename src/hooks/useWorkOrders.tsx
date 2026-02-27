import { useState, useEffect } from 'react';
import { workOrderService } from '../api/work-order.service';
import { toast } from 'sonner';
import type { WorkOrder } from '../models/work-order.model';

export const useWorkOrders = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const res = await workOrderService.getAll();
      setWorkOrders(res);
    } catch {
      toast.error('Error al obtener las órdenes de trabajo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  return { workOrders, loading, refresh: fetchWorkOrders };
};
