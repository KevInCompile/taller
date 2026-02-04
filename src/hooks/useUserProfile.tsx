import { useState, useEffect } from 'react';
import { userService } from '../api/user.service';
import { toast } from 'sonner';

export const useUserProfile = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userService.getMe();
      setProfileData(res);
    } catch (error) {
      toast.error("Error al cargar perfil");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      await userService.updateMe(data);
      toast.success("Perfil actualizado");
      return true;
    } catch (error) {
      toast.error("Error al actualizar perfil");
      return false;
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  return { profileData, setProfileData, loading, updateProfile };
};
