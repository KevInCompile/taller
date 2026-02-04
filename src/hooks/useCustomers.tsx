import { useState, useEffect } from 'react';
import { customerService } from '../api/customer.service';
import { toast } from 'sonner';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await customerService.getAll();
      setCustomers(res.customers);
    } catch (error) {
      toast.error("Error al obtener clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  return { customers, loading, refresh: fetchCustomers };
};
