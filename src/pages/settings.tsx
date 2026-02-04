import { useEffect, useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useWorkshop } from '../hooks/useWorkshop';
import { User, Store, Save, Loader2, CircleAlert } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { workshopSchema } from '../schemas/workshop.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'workshop'>('profile');
  const { profileData, setProfileData, loading: loadingUser } = useUserProfile();
  const { workshopData, loading: loadingWs, isCreating, saveWorkshop } = useWorkshop();
  // Estado para actualizar el workshop
  const setWorkshopStore = useAuthStore(state => state.setWorkshop);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(workshopSchema),
    mode: 'onChange'
  });

  useEffect(() => {
    if (activeTab === 'workshop' && workshopData) {
      reset(workshopData);
    }
  }, [workshopData, activeTab, reset]);

  const onWorkshopSubmit = async (data: any) => {
    try {
      let payload;

      if (isCreating) {
        // --- FLUJO DE CREACIÓN (POST - JSON) ---
        // Si es la primera vez, mandamos el objeto plano según tu endpoint /workshops
        payload = {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          nit: data.nit,
        };
      } else {
        // --- FLUJO DE ACTUALIZACIÓN (PUT - FormData) ---
        // Si ya existe, usamos FormData para permitir el archivo del logo
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('nit', data.nit);
        formData.append('phone', data.phone);
        formData.append('email', data.email);
        formData.append('address', data.address);

        // Si el usuario seleccionó un archivo nuevo
        if (data.logo && data.logo[0] instanceof File) {
          formData.append('logo', data.logo[0]);
        }

        payload = formData;
      }

      // Llamamos a saveWorkshop que ya maneja internamente si hace POST o PUT
      const success = await saveWorkshop(payload);

      if (success) {
        // Actualizamos Zustand con la data más reciente (sin el binario del logo)
        setWorkshopStore(data);
        toast.success(isCreating ? "¡Taller creado con éxito!" : "Datos actualizados");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.errors) {
          error.response.data.errors.forEach((err: { field: any, message: string }) => {
            setError(err.field as any, { type: 'server', message: err.message });
          });
        } else {
          toast.error("Error al procesar la solicitud");
        }
      }
    }
  };
  const isLoading = activeTab === 'profile' ? loadingUser : loadingWs;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>

      {/* Tabs Navigation */}
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        <TabButton
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          icon={<User size={18} />}
          label="Perfil Personal"
        />
        <TabButton
          active={activeTab === 'workshop'}
          onClick={() => setActiveTab('workshop')}
          icon={<Store size={18} />}
          label="Datos del Negocio"
        />
      </div>

      <form onSubmit={handleSubmit(onWorkshopSubmit)} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-2" size={40} />
            <p>Cargando información...</p>
          </div>
        ) : (
          <>
            {activeTab === 'profile' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Nombre" value={profileData?.firstName} onChange={(v) => setProfileData({...profileData, firstName: v})} />
                <InputField label="Apellido" value={profileData?.lastName} onChange={(v) => setProfileData({...profileData, lastName: v})} />
                <InputField label="Teléfono" value={profileData?.phoneNumber} onChange={(v) => setProfileData({...profileData, phoneNumber: v})} />
                <InputField label="Email" value={profileData?.email} disabled />
                <InputField label="Fecha de Nacimiento" type="date" value={profileData?.dateOfBirth} onChange={(v) => setProfileData({...profileData, dateOfBirth: v})} />
              </div>
              ) : (
                <div className="space-y-4">
                  {isCreating && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-2 text-blue-800 text-sm">
                      <CircleAlert size={18} />
                      <span>Aún no has registrado tu taller. Completa los datos.</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label="Nombre del Taller" name="name" register={register} error={errors.name?.message} />
                    <FormInput label="NIT" name="nit" register={register} error={errors.nit?.message} />
                    <FormInput label="Teléfono" name="phone" register={register} error={errors.phone?.message} />
                    <FormInput label="Email Negocio" name="email" register={register} error={errors.email?.message} />

                    <div className="md:col-span-2">
                      <FormInput label="Dirección Física" name="address" register={register} error={errors.address?.message} />
                    </div>
                    {
                      !isCreating && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Logo del Taller</label>
                          <input
                            type="file"
                            accept="image/*"
                            {...register('logo')}
                            className={`w-full p-2 bg-gray-50 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-orange-600 ${
                              errors.logo ? 'border-red-500' : 'border-gray-200'
                            }`}
                          />
                          {errors.logo?.message && (
                            <p className="text-red-500 text-xs mt-1">{String(errors.logo.message)}</p>
                          )}
                        </div>
                      )
                    }
                  </div>
                </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-brand-dark text-white px-8 py-3 rounded-xl hover:bg-black transition disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {isCreating ? 'Crear Negocio' : 'Guardar Cambios'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

// Componentes Auxiliares
const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`pb-4 px-2 flex items-center gap-2 font-medium transition-all ${active ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-gray-500 hover:text-gray-700'}`}
  >
    {icon} {label}
  </button>
);

const InputField = ({ label, value, onChange, type = "text", disabled = false }: any) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      disabled={disabled}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none disabled:opacity-60 transition-all shadow-sm"
    />
  </div>
);

const FormInput = ({ label, name, register, error, ...props }: any) => (
  <div className="w-full">
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input
      {...register(name)}
      {...props}
      className={`w-full p-3 bg-gray-50 border rounded-lg outline-none transition-all ${
        error ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-brand-accent'
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
  </div>
);
