import { Save, Loader2 } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { InputField } from '../ui/InputField';

export const ProfileTab = () => {
  const { profileData, setProfileData, loading, updateProfile } = useUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      firstName:   profileData?.firstName,
      lastName:    profileData?.lastName,
      phoneNumber: profileData?.phoneNumber,
      dateOfBirth: profileData?.dateOfBirth,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Loader2 className="animate-spin mb-2" size={40} />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Nombre"
          value={profileData?.firstName}
          onChange={(v) => setProfileData({ ...profileData, firstName: v })}
        />
        <InputField
          label="Apellido"
          value={profileData?.lastName}
          onChange={(v) => setProfileData({ ...profileData, lastName: v })}
        />
        <InputField
          label="Teléfono"
          value={profileData?.phoneNumber}
          onChange={(v) => setProfileData({ ...profileData, phoneNumber: v })}
        />
        <InputField
          label="Email"
          value={profileData?.email}
          disabled
        />
        <InputField
          label="Fecha de Nacimiento"
          type="date"
          value={profileData?.dateOfBirth}
          onChange={(v) => setProfileData({ ...profileData, dateOfBirth: v })}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="flex items-center gap-2 bg-brand-dark text-white px-8 py-3 rounded-xl hover:bg-black transition"
        >
          <Save size={20} />
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};