import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supplySchema, type SupplyFormData } from '../../schemas/supply.schema';
import { suppliesApiService } from '../../api/supplies.service';
import { X, Package, Loader2, DollarSign, Archive, FileText } from 'lucide-react';
import { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import type { Supply } from '../../models/work-order.model';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supply?: Supply;
}

const inputClass = (hasError?: boolean) =>
  `w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm ${
    hasError
      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
      : 'border-gray-200 focus:ring-2 focus:ring-brand-accent'
  }`;

const SaveIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

export const SupplyModal = ({ isOpen, onClose, onSuccess, supply }: Props) => {
  const isEditing = !!supply;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SupplyFormData>({
    resolver: zodResolver(supplySchema),
    defaultValues: { name: '', description: '', price: 0, stock: 0 },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (supply) {
      reset({
        name:        supply.name,
        description: supply.description ?? '',
        price:       Number(supply.price),
        stock:       supply.stock,
      });
    } else {
      reset({ name: '', description: '', price: 0, stock: 0 });
    }
  }, [isOpen, supply, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: SupplyFormData) => {
    try {
      if (isEditing) {
        await suppliesApiService.update(supply.id, data);
        onSuccess();
        onClose();
        Swal.fire({
          title: '¡Suministro Actualizado!',
          text: `"${data.name}" ha sido actualizado correctamente.`,
          icon: 'success',
          confirmButtonColor: '#F2633C',
          confirmButtonText: 'Aceptar',
        });
      } else {
        await suppliesApiService.create(data);
        onSuccess();
        onClose();
        Swal.fire({
          title: '¡Suministro Creado!',
          text: `"${data.name}" ha sido registrado en el inventario.`,
          icon: 'success',
          confirmButtonColor: '#F2633C',
          confirmButtonText: 'Aceptar',
        });
      }
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message ?? 'Error al procesar la solicitud'
          : 'Error inesperado';
      Swal.fire({ title: 'Error', text: msg, icon: 'error', confirmButtonColor: '#F2633C' });
    }
  };

  const watchedPrice = watch('price');
  const watchedStock = watch('stock');

  const formattedPrice =
    Number(watchedPrice) > 0
      ? new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
        }).format(Number(watchedPrice))
      : null;

  const stockLevel =
    Number(watchedStock) === 0
      ? 'out'
      : Number(watchedStock) < 5
      ? 'low'
      : 'ok';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="bg-brand-dark p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="text-brand-accent" size={22} />
            <div>
              <h2 className="text-lg font-bold leading-tight">
                {isEditing ? 'Editar Suministro' : 'Nuevo Suministro'}
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">
                {isEditing ? `Modificando "${supply.name}"` : 'Agrega un nuevo ítem al inventario'}
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
              <Archive size={15} className="text-gray-400" />
              Nombre del suministro <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              placeholder="Ej: Aceite 5W-30, Filtro de aire, Pastillas de freno..."
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
              <FileText size={15} className="text-gray-400" />
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Describe el suministro, marca, especificaciones técnicas..."
              className={inputClass(!!errors.description) + ' resize-none'}
            />
            {errors.description && (
              <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">

            {/* Price */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <DollarSign size={15} className="text-gray-400" />
                Precio unitario <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold select-none">
                  $
                </span>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0"
                  className={inputClass(!!errors.price) + ' pl-7'}
                />
              </div>
              {errors.price ? (
                <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.price.message}</p>
              ) : formattedPrice ? (
                <p className="text-green-600 text-[10px] mt-1 font-bold">{formattedPrice}</p>
              ) : null}
            </div>

            {/* Stock */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <Package size={15} className="text-gray-400" />
                Cantidad en stock <span className="text-red-500">*</span>
              </label>
              <input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                min={0}
                step={1}
                placeholder="0"
                className={inputClass(!!errors.stock)}
              />
              {errors.stock ? (
                <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.stock.message}</p>
              ) : Number(watchedStock) >= 0 ? (
                <p className={`text-[10px] mt-1 font-bold ${
                  stockLevel === 'out' ? 'text-red-500' :
                  stockLevel === 'low' ? 'text-amber-500' :
                  'text-green-600'
                }`}>
                  {stockLevel === 'out' ? '⚠ Sin stock' :
                   stockLevel === 'low' ? `⚠ Stock bajo (${watchedStock} unidades)` :
                   `✓ ${watchedStock} unidades disponibles`}
                </p>
              ) : null}
            </div>

          </div>

          {/* Summary preview when editing */}
          {isEditing && formattedPrice && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Valor total en stock</p>
                <p className="text-lg font-bold text-gray-800 mt-0.5">
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                  }).format(Number(watchedPrice) * Number(watchedStock))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{watchedStock} un. × {formattedPrice}</p>
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-2">
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
                <><SaveIcon /> {isEditing ? 'Guardar Cambios' : 'Crear Suministro'}</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};