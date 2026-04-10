import api from './auth.service';
import type { Supply } from '../modules/orders/schemas/work-order.model';

export interface SupplyInput {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export const suppliesApiService = {

  getAll: async (): Promise<Supply[]> => {
    const { data } = await api.get('/supplies');
    return Array.isArray(data) ? data : [];
  },

  getById: async (id: string): Promise<Supply> => {
    const { data } = await api.get(`/supplies/${id}`);
    return data;
  },

  create: async (supply: SupplyInput): Promise<Supply> => {
    const { data } = await api.post('/supplies', supply);
    return data;
  },

  update: async (id: string, supply: Partial<SupplyInput>): Promise<Supply> => {
    const { data } = await api.patch(`/supplies/${id}`, supply);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/supplies/${id}`);
  },
};
