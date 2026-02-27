import api from './auth.service';
import type { Service } from '../models/work-order.model';

export interface ServiceInput {
  name: string;
}

export const servicesCatalogService = {

  getAll: async (): Promise<Service[]> => {
    const { data } = await api.get('/services');
    return Array.isArray(data) ? data : [];
  },

  getById: async (id: string): Promise<Service> => {
    const { data } = await api.get(`/services/${id}`);
    return data;
  },

  create: async (service: ServiceInput): Promise<Service> => {
    const { data } = await api.post('/services', service);
    return data;
  },

  update: async (id: string, service: Partial<ServiceInput>): Promise<Service> => {
    const { data } = await api.patch(`/services/${id}`, service);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};