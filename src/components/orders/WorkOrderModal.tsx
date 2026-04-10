import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workOrderSchema, type WorkOrderFormData } from '../../schemas/work-order.schema';
import { workOrderService } from '../../api/work-order.service';
import { useCustomers } from '../../hooks/useCustomers';
import { useServices } from '../../hooks/useServices';
import { useSupplies } from '../../hooks/useSupplies';
import { PRIORITY_OPTIONS } from '../../models/work-order.constants';
import type { WorkOrder } from '../../models/work-order.model';
import {
  X, ClipboardList, User, Car, Wrench, Calendar, FileText,
  Plus, Trash2, Loader2, Package, DollarSign, ChevronDown,
} from 'lucide-react';

import { AxiosError } from 'axios';
import { formatCurrency } from '../../helpers/helpers';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workOrder?: WorkOrder;
}

// Section header helper
const SectionTitle = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="text-brand-accent">{icon}</div>
    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{label}</h3>
    <div className="flex-1 h-px bg-gray-100 ml-1" />
  </div>
);

// ─── Select wrapper
const SelectField = ({
  label, required, error, children, icon,
}: {
  label: string; required?: boolean; error?: string;
  children: React.ReactNode; icon?: React.ReactNode;
}) => (
  <div className="w-full">
    <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
      {icon} {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {children}
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
    {error && <p className="text-red-500 text-[10px] mt-1 font-medium">{error}</p>}
  </div>
);

// ─── Text / number input helper
const Field = ({
  label, required, error, icon, children,
}: {
  label: string; required?: boolean; error?: string;
  icon?: React.ReactNode; children: React.ReactNode;
}) => (
  <div className="w-full">
    <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
      {icon} {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-[10px] mt-1 font-medium">{error}</p>}
  </div>
);

const inputClass = (hasError?: boolean) =>
  `w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm ${
    hasError
      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
      : 'border-gray-200 focus:ring-2 focus:ring-brand-accent'
  }`;

const selectClass = (hasError?: boolean) =>
  `w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm appearance-none pr-8 ${
    hasError
      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
      : 'border-gray-200 focus:ring-2 focus:ring-brand-accent'
  }`;

export const WorkOrderModal = ({ isOpen, onClose, onSuccess, workOrder }: Props) => {
  const isEditing = !!workOrder;
  const { customers } = useCustomers();
  const { services } = useServices();
  const { supplies } = useSupplies();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      priority: 'MEDIUM',
      supplies: [],
      subtotal: 0,
      total: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'supplies' });

  const watchedCustomerId = watch('customerId');
  const watchedSupplies= watch('supplies');

  const selectedCustomer = customers.find(c => c.id === watchedCustomerId);
  const vehicleOptions   = selectedCustomer?.vehicles ?? [];

  // Reset vehicle when customer changes
  useEffect(() => {
    if (!isEditing) setValue('vehicleId', '');
  }, [watchedCustomerId, setValue, isEditing]);

  // Pre-fill form when editing or clear when creating
  useEffect(() => {
    if (!isOpen) return;

    if (workOrder) {
      reset({
        customerId: workOrder.customerId,
        vehicleId: workOrder.vehicleId,
        serviceId: workOrder.serviceId,
        mechanic: workOrder.mechanic,
        priority: workOrder.priority,
        startDate:       workOrder.startDate.slice(0, 16),
        description: workOrder.description,
        additionalNotes: workOrder.additionalNotes ?? '',
        subtotal: Number(workOrder.subtotal),
        total: Number(workOrder.total),
        supplies: workOrder.supplies?.map(s => ({
          supplyId: s.supplyId,
          quantity: s.quantity,
        })) ?? [],
      });
    } else {
      reset({
        customerId: '',
        vehicleId: '',
        serviceId: '',
        mechanic: '',
        priority: 'MEDIUM',
        startDate: '',
        description: '',
        additionalNotes: '',
        subtotal: 0,
        total: 0,
        supplies: [],
      });
    }
  }, [isOpen, workOrder, reset]);

  // Auto-calculate subtotal from supplies
  useEffect(() => {
    if (!watchedSupplies?.length) return;
    const total = watchedSupplies.reduce((acc, item) => {
      const supply = supplies.find(s => s.id === item.supplyId);
      return acc + (supply ? Number(supply.price) : 0) * (item.quantity ?? 1);
    }, 0);
    if (total > 0) setValue('subtotal', total);
  }, [watchedSupplies, supplies, setValue]);

  if (!isOpen) return null;

  const onSubmit = async (data: WorkOrderFormData) => {
    try {
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
      };

      if (isEditing) {
        await workOrderService.update(workOrder.id, payload);
        onSuccess();
        onClose();
        toast.success("Los cambios han sido guardados correctamente.")
      } else {
        await workOrderService.create(payload);
        onSuccess();
        onClose();
        toast.success("La orden ha sido creada con exito")
      }
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message ?? 'Error al procesar la solicitud'
          : 'Error inesperado';
      toast.error(msg)
    }
  };

  const handleAddSupply = () => {
    append({ supplyId: '', quantity: 1 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* ── Header ── */}
        <div className="bg-brand-dark px-8 py-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-brand-accent" size={22} />
            <div>
              <h2 className="text-lg font-bold leading-tight">
                {isEditing ? 'Editar Orden de Trabajo' : 'Nueva Orden de Trabajo'}
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">
                {isEditing ? 'Modifica los datos de la orden' : 'Completa todos los campos requeridos'}
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

        {/* ── Scrollable body ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-8 space-y-8"
        >

          {/* ─── 1. Cliente & Vehículo ─── */}
          <div>
            <SectionTitle icon={<User size={16} />} label="Cliente & Vehículo" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <SelectField
                label="Cliente"
                required
                error={errors.customerId?.message}
                icon={<User size={15} />}
              >
                <select
                  {...register('customerId')}
                  className={selectClass(!!errors.customerId)}
                >
                  <option value="">Selecciona un cliente...</option>
                  {(customers ?? []).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} — {c.phone}
                    </option>
                  ))}
                </select>
              </SelectField>

              <SelectField
                label="Vehículo"
                required
                error={errors.vehicleId?.message}
                icon={<Car size={15} />}
              >
                <select
                  {...register('vehicleId')}
                  disabled={!watchedCustomerId}
                  className={selectClass(!!errors.vehicleId) + (!watchedCustomerId ? ' opacity-50 cursor-not-allowed' : '')}
                >
                  <option value="">
                    {watchedCustomerId ? 'Selecciona un vehículo...' : 'Primero selecciona un cliente'}
                  </option>
                  {(vehicleOptions ?? []).map(v => (
                    <option key={v.id} value={v.id}>
                      {v.plate} — {v.brand} {v.model} ({v.year})
                    </option>
                  ))}
                </select>
              </SelectField>

            </div>
          </div>

          {/* ─── 2. Servicio & Mecánico ─── */}
          <div>
            <SectionTitle icon={<Wrench size={16} />} label="Servicio & Mecánico" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <SelectField
                label="Tipo de Servicio"
                required
                error={errors.serviceId?.message}
                icon={<ClipboardList size={15} />}
              >
                <select
                  {...register('serviceId')}
                  className={selectClass(!!errors.serviceId)}
                >
                  <option value="">Selecciona un servicio...</option>
                  {(services ?? []).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </SelectField>

              <Field
                label="Mecánico Asignado"
                required
                error={errors.mechanic?.message}
                icon={<Wrench size={15} />}
              >
                <input
                  {...register('mechanic')}
                  placeholder="Nombre del mecánico"
                  className={inputClass(!!errors.mechanic)}
                />
              </Field>

            </div>
          </div>

          {/* ─── 3. Detalles del Trabajo ─── */}
          <div>
            <SectionTitle icon={<FileText size={16} />} label="Detalles del Trabajo" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <SelectField
                label="Prioridad"
                required
                error={errors.priority?.message}
              >
                <select
                  {...register('priority')}
                  className={selectClass(!!errors.priority)}
                >
                  {PRIORITY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </SelectField>

              <Field
                label="Fecha de Inicio"
                required
                error={errors.startDate?.message}
                icon={<Calendar size={15} />}
              >
                <input
                  {...register('startDate')}
                  type="datetime-local"
                  className={inputClass(!!errors.startDate)}
                />
              </Field>

              <div className="md:col-span-2">
                <Field
                  label="Descripción del Trabajo"
                  required
                  error={errors.description?.message}
                  icon={<FileText size={15} />}
                >
                  <textarea
                    {...register('description')}
                    rows={3}
                    placeholder="Describe el trabajo a realizar en detalle..."
                    className={inputClass(!!errors.description) + ' resize-none'}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field
                  label="Notas Adicionales"
                  error={errors.additionalNotes?.message}
                >
                  <textarea
                    {...register('additionalNotes')}
                    rows={2}
                    placeholder="Ej: Cliente prefiere repuestos originales, revisar también frenos traseros..."
                    className={inputClass(!!errors.additionalNotes) + ' resize-none'}
                  />
                </Field>
              </div>

            </div>
          </div>

          {/* ─── 4. Suministros ─── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="text-brand-accent"><Package size={16} /></div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Suministros</h3>
                <div className="flex-1 h-px bg-gray-100 ml-1 w-16" />
                {fields.length > 0 && (
                  <span className="bg-brand-accent/10 text-brand-accent text-xs font-bold px-2 py-0.5 rounded-full">
                    {fields.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddSupply}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-accent hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors"
              >
                <Plus size={14} /> Agregar Suministro
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                <Package size={28} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400 font-medium">Sin suministros agregados</p>
                <p className="text-xs text-gray-300 mt-1">Puedes agregar repuestos, aceites, filtros, etc.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-12 gap-3 px-3 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  <div className="col-span-7">Suministro</div>
                  <div className="col-span-3 text-center">Cantidad</div>
                  <div className="col-span-2 text-right">Precio Unit.</div>
                </div>

                {fields.map((field, index) => {
                  const supplyId = watchedSupplies?.[index]?.supplyId;
                  const selectedSup = supplies.find(s => s.id === supplyId);
                  const qty = watchedSupplies?.[index]?.quantity ?? 1;
                  const lineTotal = selectedSup ? Number(selectedSup.price) * qty : 0;

                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-3 items-center bg-gray-50 border border-gray-200 rounded-xl p-3"
                    >
                      {/* Supply select */}
                      <div className="col-span-7">
                        <div className="relative">
                          <select
                            {...register(`supplies.${index}.supplyId`)}
                            className={selectClass(!!errors.supplies?.[index]?.supplyId) + ' text-xs bg-white'}
                          >
                            <option value="">Selecciona suministro...</option>
                            {(supplies ?? []).map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name} {s.unit ? `(${s.unit})` : ''} — {formatCurrency(s.price)}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.supplies?.[index]?.supplyId && (
                          <p className="text-red-500 text-[10px] mt-0.5 font-medium">
                            {errors.supplies[index]!.supplyId!.message}
                          </p>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-3">
                        <input
                          {...register(`supplies.${index}.quantity`, { valueAsNumber: true })}
                          type="number"
                          min={1}
                          placeholder="1"
                          className={inputClass(!!errors.supplies?.[index]?.quantity) + ' text-xs text-center bg-white'}
                        />
                      </div>

                      {/* Line total + remove */}
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        {lineTotal > 0 && (
                          <span className="text-[10px] font-bold text-green-600 whitespace-nowrap">
                            {formatCurrency(lineTotal)}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                          title="Eliminar suministro"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─── 5. Facturación ─── */}
          <div>
            <SectionTitle icon={<DollarSign size={16} />} label="Facturación" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Field
                label="Subtotal"
                required
                error={errors.subtotal?.message}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                  <input
                    {...register('subtotal', { valueAsNumber: true })}
                    type="number"
                    min={0}
                    placeholder="0"
                    className={inputClass(!!errors.subtotal) + ' pl-7'}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  {watch('subtotal') > 0 ? formatCurrency(watch('subtotal')) : ''}
                </p>
              </Field>

              <Field
                label="Total (incluye mano de obra e impuestos)"
                required
                error={errors.total?.message}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                  <input
                    {...register('total', { valueAsNumber: true })}
                    type="number"
                    min={0}
                    placeholder="0"
                    className={inputClass(!!errors.total) + ' pl-7'}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  {watch('total') > 0 ? (
                    <span className="font-bold text-green-600">{formatCurrency(watch('total'))}</span>
                  ) : ''}
                </p>
              </Field>

            </div>

            {/* Summary */}
            {watch('total') > 0 && (
              <div className="mt-4 bg-brand-dark rounded-xl px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total de la Orden</p>
                  <p className="text-2xl font-bold text-white mt-0.5">{formatCurrency(watch('total'))}</p>
                </div>
                {watch('subtotal') > 0 && watch('total') > watch('subtotal') && (
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">Mano de obra / otros</p>
                    <p className="text-brand-accent font-bold text-sm">
                      +{formatCurrency(watch('total') - watch('subtotal'))}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        </form>

        {/* ── Footer ── */}
        <div className="border-t border-gray-100 px-8 py-5 flex items-center justify-between bg-gray-50/80 flex-shrink-0">
          <p className="text-xs text-gray-400">
            Los campos marcados con <span className="text-red-500 font-bold">*</span> son obligatorios
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="work-order-form"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="bg-brand-accent text-white px-8 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin" size={18} /> Guardando...</>
              ) : (
                <><ClipboardList size={18} /> {isEditing ? 'Guardar Cambios' : 'Crear Orden'}</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
