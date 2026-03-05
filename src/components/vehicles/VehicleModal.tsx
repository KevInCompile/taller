import { toast } from "sonner";
import { customerService } from "../../api/customer.service";
import { vehicleSchema, type VehicleFormData } from "../../schemas/vehicle.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CarFront, Loader2, Plus } from "lucide-react";
import { FormInput } from "../customers/CustomerModal";

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  onSuccess: () => void;
}

export const VehicleModal = ({ isOpen, onClose, customerId, customerName, onSuccess }: VehicleModalProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema)
  });

  const onSubmit = async (data: VehicleFormData) => {
    try {
      await customerService.addVehicle(customerId, data);
      toast.success(`Vehículo asignado a ${customerName}`);
      reset();
      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al registrar el vehículo");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-brand-accent p-6 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CarFront size={24} /> Agregar Vehículo a:
          </h2>
          <p className="text-orange-100 font-medium">{customerName}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 grid grid-cols-2 gap-4">
          <FormInput label="Placa" name="plate" register={register} error={errors.plate?.message} placeholder="ABC-123" />
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 mb-1">Tipo</label>
            <select {...register('type')} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
              <option value="CAR">Carro</option>
              <option value="MOTORCYCLE">Moto</option>
            </select>
          </div>
          <FormInput label="Marca" name="brand" register={register} error={errors.brand?.message} placeholder="Ej: Toyota" />
          <FormInput label="Modelo" name="model" register={register} error={errors.model?.message} placeholder="Ej: Corolla" />
          <FormInput label="Año" name="year" type="number" register={register} error={errors.year?.message} />
          <FormInput label="Kilometraje" name="mileage" type="number" register={register} error={errors.mileage?.message} />
          <div className="col-span-2">
             <FormInput label="Color" name="color" register={register} error={errors.color?.message} />
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500 font-semibold">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Plus size={20}/>}
              Guardar Vehículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
