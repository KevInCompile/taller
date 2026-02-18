import api from './auth.service';
import type { Customer, Vehicle } from '../types/customer';
import type { CustomerFormData } from '../schemas/customer.schema';

export const customerService = {
  getAll: async (): Promise<{ customers: Customer[] }> => {
    const { data } = await api.get('/customers');
    return data;
  },

  create: async (customer: CustomerFormData): Promise<Customer> => {
    const { data } = await api.post('/customers', customer);
    return data;
  },

  addVehicle: async (customerId: string, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
    const { data } = await api.post(`/customers/${customerId}/vehicles`, vehicle);
    return data;
  }
};
