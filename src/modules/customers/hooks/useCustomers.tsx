import { useState, useEffect } from 'react';
import { customerService } from '../../../api/customer.service';
import { toast } from 'sonner';
import type { Customer } from '../schemas/customer.model';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await customerService.getAll();
      setCustomers(res?.customers ?? []);
    } catch (error: unknown) {
      toast.error("Error al obtener clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  return { customers, loading, refresh: fetchCustomers };
};
