import api from './auth.service';
import type { WorkOrderFormData } from '../schemas/work-order.schema';
import type { WorkOrder } from '../models/work-order.model';

export const workOrderService = {

  getAll: async (): Promise<WorkOrder[]> => {
    const { data } = await api.get('/work-orders');
    return Array.isArray(data) ? data : (data?.workOrders ?? []);
  },

  getById: async (id: string): Promise<WorkOrder> => {
    const { data } = await api.get(`/work-orders/${id}`);
    return data;
  },

  create: async (workOrder: WorkOrderFormData): Promise<WorkOrder> => {
    const { data } = await api.post('/work-orders', workOrder);
    return data;
  },

  update: async (id: string, workOrder: Partial<WorkOrderFormData>): Promise<WorkOrder> => {
    const { data } = await api.patch(`/work-orders/${id}`, workOrder);
    return data;
  },

  updateStatus: async (id: string, status: string): Promise<WorkOrder> => {
    const { data } = await api.patch(`/work-orders/${id}/status`, { status });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/work-orders/${id}`);
  },
};