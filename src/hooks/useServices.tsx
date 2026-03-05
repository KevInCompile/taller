import { useState, useEffect } from 'react';
import { servicesCatalogService } from '../api/services-catalog.service';
import { toast } from 'sonner';
import type { Service } from '../models/work-order.model';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await servicesCatalogService.getAll();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      setServices([]);
      toast.error('Error al obtener los servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);
 return { services, loading, refresh: fetchServices };
};
