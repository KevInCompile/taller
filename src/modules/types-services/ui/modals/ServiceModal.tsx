import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, type ServiceFormData } from '../../schemas/types-service.schema';
import { servicesCatalogService } from '../../../../api/services-catalog.service';
import { X, ClipboardList, Loader2, Tag } from 'lucide-react';
import { AxiosError } from 'axios';
import type { Service } from '../../../orders/schemas/work-order.model';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service?: Service;
}

const SaveIcon = () => (
  <svg
    width={17}
    height={17}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

export const ServiceModal = ({ isOpen, onClose, onSuccess, service }: Props) => {
  const isEditing = !!service;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (!isOpen) return;
    reset({ name: service?.name ?? '' });
  }, [isOpen, service, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (isEditing) {
        await servicesCatalogService.update(service.id, data);
        onSuccess();
        onClose();
        toast.success(`"${data.name}" ha sido actualizado correctamente.`);
      } else {
        await servicesCatalogService.create(data);
        onSuccess();
        onClose();
        toast.success(`"${data.name}" ha sido agregado al catálogo de servicios.`);
      }
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message ?? 'Error al procesar la solicitud'
          : 'Error inesperado';
      toast.error(msg)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* ── Header ── */}
        <div className="bg-brand-dark p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-brand-accent" size={22} />
            <div>
              <h2 className="text-lg font-bold leading-tight">
                {isEditing ? 'Editar Tipo de Servicio' : 'Nuevo Tipo de Servicio'}
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">
                {isEditing
                  ? `Modificando "${service.name}"`
                  : 'Agrega un servicio al catálogo del taller'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

          {/* Name field */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
              <Tag size={15} className="text-gray-400" />
              Nombre del servicio <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              placeholder="Ej: Mantenimiento, Frenos, Cambio de aceite..."
              autoFocus
              className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm ${
                errors.name
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-2 focus:ring-brand-accent'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-[10px] mt-1.5 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Info note */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-start gap-2.5">
            <ClipboardList size={15} className="text-brand-accent mt-0.5 shrink-0" />
            <p className="text-xs text-orange-700 leading-relaxed">
              Los tipos de servicio se usan al crear órdenes de trabajo para categorizar
              el tipo de intervención realizada en el vehículo.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-accent text-white px-7 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin" size={17} /> Guardando...</>
              ) : (
                <><SaveIcon /> {isEditing ? 'Guardar Cambios' : 'Crear Servicio'}</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
