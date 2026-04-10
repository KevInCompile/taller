import api from './auth.service';
import type { CustomerFormData } from '../modules/customers/schemas/customer.schema';
import type { Customer, Vehicle } from '../modules/customers/schemas/customer.model';

export const customerService = {

  getById: async (id: string): Promise<Customer> => {
    const { data } = await api.get(`/customers/${id}`);
    return data;
  },

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
  },

  update: async (id: string, customer: Partial<CustomerFormData>): Promise<Customer> => {
    const { data } = await api.patch(`/customers/${id}`, customer);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },

  deleteVehicle: async (vehicleId: string): Promise<void> => {
    await api.delete(`/customers/vehicles/${vehicleId}`);
  }
};
