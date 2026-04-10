import { useState, useEffect } from 'react';
import { customerService } from '../../../api/customer.service';
import { toast } from 'sonner';
import type { Customer } from '../schemas/customer.model';
import { useParams } from 'react-router-dom';

export const useCustomerById = () => {
  const [customer, setCustomer] = useState({} as Customer);
  const [loading, setLoading] = useState(true);
  const params = useParams()

  const fetchCustomers = async () => {
    try {
      const res = await customerService.getById(params.id || '0');
      setCustomer(res);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al obtener clientes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  return { customer, loading, refresh: fetchCustomers };
};
