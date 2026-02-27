import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, User, Phone, Mail, MapPin, Notebook, Loader2 } from 'lucide-react';
import { customerSchema, type CustomerFormData } from '../../schemas/customer.schema';
import { customerService } from '../../api/customer.service';
import { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import type { Customer } from '../../models/customer.model';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenVehicleModal: (id: string, name: string) => void;
  customer?: Customer;
}

export const CustomerModal = ({ isOpen, onClose, onSuccess, onOpenVehicleModal, customer }: Props) => {
  const isEditing = !!customer;

  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        customer
          ? {
              firstName: customer.firstName,
              lastName: customer.lastName,
              email: customer.email,
              phone: customer.phone,
              address: customer.address ?? '',
              notes: customer.notes ?? '',
            }
          : { firstName: '', lastName: '', email: '', phone: '', address: '', notes: '' }
      );
    }
  }, [isOpen, customer, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (isEditing) {
        await customerService.update(customer.id, data);
        onSuccess();
        onClose();
        Swal.fire({
          title: '¡Cliente Actualizado!',
          text: `Los datos de ${data.firstName} han sido guardados correctamente.`,
          icon: 'success',
          confirmButtonColor: '#F2633C',
          confirmButtonText: 'Aceptar',
        });
      } else {
        const newCustomer = await customerService.create(data);
        onSuccess();
        onClose();
        Swal.fire({
          title: '¡Cliente Registrado!',
          text: `¿Deseas agregar un vehículo a ${newCustomer.firstName}?`,
          showCancelButton: true,
          confirmButtonColor: '#F2633C',
          cancelButtonColor: '#1F2937',
          confirmButtonText: 'Sí, agregar vehículo',
          cancelButtonText: 'Más tarde',
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            onOpenVehicleModal(newCustomer.id, `${newCustomer.firstName} ${newCustomer.lastName}`);
          }
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data.message.includes('phone')) {
          setError('phone', { type: 'manual', message: 'El teléfono ya existe' });
        }
        if (error.response?.data.message.includes('email')) {
          setError('email', { type: 'manual', message: 'El email ya existe' });
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-brand-dark p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <User className="text-brand-accent" />
            <h2 className="text-xl font-bold">{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Nombre"
              required
              name="firstName"
              register={register}
              error={errors.firstName?.message}
              icon={<User size={18} />}
            />
            <FormInput
              label="Apellido"
              required
              name="lastName"
              register={register}
              error={errors.lastName?.message}
              icon={<User size={18} />}
            />
            <FormInput
              label="Teléfono"
              required
              name="phone"
              register={register}
              error={errors.phone?.message}
              icon={<Phone size={18} />}
            />
            <FormInput
              label="Email"
              required
              name="email"
              register={register}
              error={errors.email?.message}
              icon={<Mail size={18} />}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Dirección (Opcional)"
                name="address"
                register={register}
                icon={<MapPin size={18} />}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <Notebook size={16} /> Notas Adicionales
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                placeholder="Ej: Cliente preferencial, prefiere repuestos originales..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-accent text-white px-8 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEditing ? 'Guardar Cambios' : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const FormInput = ({ label, required, name, register, error, icon, ...props }: any) => (
  <div className="w-full">
    <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
      {icon} {label} {required ? <span className="text-red-500">*</span> : ''}
    </label>
    <input
      {...register(name)}
      {...props}
      className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all ${
        error
          ? 'border-red-500 focus:ring-2 focus:ring-red-200'
          : 'border-gray-200 focus:ring-2 focus:ring-brand-accent'
      }`}
    />
    {error && <p className="text-red-500 text-[10px] mt-1 font-medium">{error}</p>}
  </div>
);

const Save = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
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