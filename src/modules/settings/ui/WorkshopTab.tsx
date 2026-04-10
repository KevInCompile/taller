import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workshopSchema, type WorkshopFormData } from '../schemas/workshop.schema';
import { useWorkshop } from '../hooks/useWorkshop';
import { useAuthStore } from '../../../store/useAuthStore';
import { FormInput } from '../../../components/ui/FormInput';
import { Save, Loader2, CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const WorkshopTab = () => {
  const { workshopData, loading, isCreating, saveWorkshop } = useWorkshop();
  const setWorkshopStore = useAuthStore(state => state.setWorkshop);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<WorkshopFormData>({
    resolver: zodResolver(workshopSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (workshopData) {
      reset(workshopData);
    }
  }, [workshopData, reset]);

  const onSubmit: SubmitHandler<WorkshopFormData> = async (data) => {
    try {
      let payload;

      if (isCreating) {
        payload = {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          nit: data.nit,
        };
      } else {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('nit', data.nit);
        formData.append('phone', data.phone);
        formData.append('email', data.email);
        formData.append('address', data.address);

        if (data.logo && data.logo[0] instanceof File) {
          formData.append('logo', data.logo[0]);
        }
        payload = formData;
      }

      const success = await saveWorkshop(payload);

      if (success) {
        // Crear objeto workshop con id si está disponible
        const workshopToStore = {
          id: workshopData?.id || 'temp-id',
          name: data.name,
          nit: data.nit,
          phone: data.phone,
          email: data.email,
          address: data.address,
        };
        setWorkshopStore(workshopToStore);
        toast.success(isCreating ? '¡Taller creado con éxito!' : 'Datos actualizados');
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.errors) {
          error.response.data.errors.forEach((err: { field: string; message: string }) => {
            setError(err.field as keyof WorkshopFormData, { type: 'server', message: err.message });
          });
        } else {
          toast.error('Error al procesar la solicitud');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="animate-spin mb-2" size={40} />
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isCreating && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-2 text-blue-800 text-sm">
          <CircleAlert size={18} />
          <span>Aún no has registrado tu taller. Completa los datos.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Nombre del Taller"
          name="name"
          register={register}
          error={errors.name?.message}
        />
        <FormInput
          label="NIT"
          name="nit"
          register={register}
          error={errors.nit?.message}
        />
        <FormInput
          label="Teléfono"
          name="phone"
          register={register}
          error={errors.phone?.message}
        />
        <FormInput
          label="Email Negocio"
          name="email"
          register={register}
          error={errors.email?.message}
        />

        <div className="md:col-span-2">
          <FormInput
            label="Dirección Física"
            name="address"
            register={register}
            error={errors.address?.message}
          />
        </div>

        {!isCreating && (
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Logo del Taller
            </label>
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
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-brand-dark text-white px-8 py-3 rounded-xl hover:bg-black transition disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isCreating ? 'Crear Negocio' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};
