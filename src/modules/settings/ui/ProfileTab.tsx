import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormData } from '../schemas/profile.schema';
import { useUserProfile } from '../hooks/useUserProfile';
import { FormInput } from '../../../components/ui/FormInput';
import { InputField } from '../design-system/InputField';
import { Save, Loader2 } from 'lucide-react';

export const ProfileTab = () => {
  const { profileData, loading, updateProfile } = useUserProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (profileData) {
      reset({
        firstName:   profileData.firstName   ?? '',
        lastName:    profileData.lastName    ?? '',
        phoneNumber: profileData.phoneNumber ?? '',
        dateOfBirth: profileData.dateOfBirth ?? '',
      });
    }
  }, [profileData, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    await updateProfile(data);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Nombre"
          name="firstName"
          register={register}
          error={errors.firstName?.message}
        />
        <FormInput
          label="Apellido"
          name="lastName"
          register={register}
          error={errors.lastName?.message}
        />
        <FormInput
          label="Teléfono"
          name="phoneNumber"
          register={register}
          error={errors.phoneNumber?.message}
        />
        <InputField
          label="Email"
          value={profileData?.email}
          disabled
        />
        <FormInput
          label="Fecha de Nacimiento"
          name="dateOfBirth"
          type="date"
          register={register}
          error={errors.dateOfBirth?.message}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-foreground text-elements px-8 py-3 rounded-xl hover:opacity-70 transition disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};
