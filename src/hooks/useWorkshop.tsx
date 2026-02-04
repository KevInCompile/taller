import { useState, useEffect } from 'react';
import { workshopService } from '../api/user.service';
import { toast } from 'sonner';

export const useWorkshop = () => {
  const [workshopData, setWorkshopData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchWorkshop = async () => {
    setLoading(true);
    try {
      const res = await workshopService.getMyWorkshop();
      setWorkshopData(res);
      setIsCreating(false);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setIsCreating(true);
        setWorkshopData({ name: '', address: '', phone: '', email: '', logo: '', nit: '' });
      } else {
        toast.error("Error al cargar el taller");
      }
    } finally {
      setLoading(false);
    }
  };

  const saveWorkshop = async (data: any) => {
    try {
      if (isCreating) {
        console.log("Creando")
        await workshopService.createWorkshop(data);
        toast.success("¡Taller registrado!");
        setIsCreating(false);
      } else {
        await workshopService.updateWorkshop(data.id, data);
        toast.success("Taller actualizado");
      }
      return true;
    } catch (error) {
      toast.error("Error al guardar datos del taller");
      return false;
    }
  };

  useEffect(() => { fetchWorkshop(); }, []);

  return { workshopData, setWorkshopData, loading, isCreating, saveWorkshop };
};
