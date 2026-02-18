import { useState, useEffect } from 'react';
import { customerService } from '../api/customer.service';
import { toast } from 'sonner';
import type { Customer } from '../models/customer.model';
import { useParams } from 'react-router-dom';

export const useCustomerById = () => {
  const [customer, setCustomer] = useState({} as Customer);
  const [loading, setLoading] = useState(true);
  const params = useParams()

  const fetchCustomers = async () => {
    try {
      const res = await customerService.getById(params.id);
      setCustomer(res);
    } catch (error: unknown) {
      toast.error("Error al obtener clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  return { customer, loading, refresh: fetchCustomers };
};
