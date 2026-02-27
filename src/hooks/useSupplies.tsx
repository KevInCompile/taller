import { useState, useEffect } from 'react';
import { suppliesApiService } from '../api/supplies.service';
import { toast } from 'sonner';
import type { Supply } from '../models/work-order.model';

export const useSupplies = () => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSupplies = async () => {
    setLoading(true);
    try {
      const data = await suppliesApiService.getAll();
      setSupplies(Array.isArray(data) ? data : []);
    } catch {
      setSupplies([]);
      toast.error('Error al obtener los suministros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSupplies(); }, []);

  return { supplies, loading, refresh: fetchSupplies };
};