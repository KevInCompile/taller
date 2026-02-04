import api from './auth.service';
import type { Customer, CustomerCreateInput, Vehicle } from '../types/customer';

export const customerService = {
  getAll: async (): Promise<{ customers: Customer[] }> => {
    const { data } = await api.get('/customers');
    return data;
  },

  create: async (customer: CustomerCreateInput): Promise<Customer> => {
    const { data } = await api.post('/customers', customer);
    return data;
  },

  addVehicle: async (customerId: string, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
    const { data } = await api.post(`/customers/${customerId}/vehicles`, vehicle);
    return data;
  }
};
