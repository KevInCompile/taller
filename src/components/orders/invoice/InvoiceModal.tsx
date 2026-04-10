import { X, Printer, FileText, Building, User, Car, Calendar, Wrench, Package } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../helpers/helpers';
import type { WorkOrder } from '../../../models/work-order.model';
import { useAuthStore } from '../../../store/useAuthStore';
import { useState, useRef } from 'react';
import type { Workshop } from '../../../store/useAuthStore';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder | null;
}

export const InvoiceModal = ({ isOpen, onClose, workOrder }: InvoiceModalProps) => {
  const workshop = useAuthStore(state => state.workshop);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen) return null;
  if(!workOrder) return <></>

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  // Calcular totales
  const subtotal = parseFloat(workOrder.subtotal) || 0;
  const total = parseFloat(workOrder.total) || 0;
  const tax = total - subtotal;

  // Información de la empresa (workshop)
  const companyInfo: Workshop = workshop || {
    id: 'default',
    name: 'Taller Mecánico',
    nit: 'NIT 900.000.000-0',
    phone: '(123) 456-7890',
    email: 'info@taller.com',
    address: 'Calle Principal #123, Ciudad',
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Factura de Servicio</h2>
              <p className="text-sm text-gray-500">Orden #{workOrder.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenido de la factura */}
        <div className="flex-1 overflow-auto p-6">
          <div
            ref={invoiceRef}
            className="bg-white p-8 border border-gray-200 rounded-xl max-w-3xl mx-auto print:p-0 print:border-0 print:shadow-none"
            style={isPrinting ? { boxShadow: 'none', border: 'none' } : {}}
          >
            {/* Encabezado */}
            <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="text-brand-accent" size={20} />
                  <h3 className="text-xl font-bold text-gray-800">{companyInfo.name}</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>NIT:</strong> {companyInfo.nit}</p>
                  <p><strong>Teléfono:</strong> {companyInfo.phone}</p>
                  <p><strong>Dirección:</strong> {companyInfo.address}</p>
                </div>
              </div>

              <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">FACTURA</h1>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">N° {workOrder.id.slice(-8).toUpperCase()}</p>
                  <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{formatDate(workOrder.startDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="text-brand-accent" size={18} />
                  <h4 className="font-bold text-gray-800">Cliente</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Nombre:</strong> {workOrder.customer?.firstName} {workOrder.customer?.lastName}</p>
                  <p><strong>Teléfono:</strong> {workOrder.customer?.phone}</p>
                  <p><strong>Email:</strong> {workOrder.customer?.email || 'No registrado'}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Car className="text-brand-accent" size={18} />
                  <h4 className="font-bold text-gray-800">Vehículo</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Placa:</strong> {workOrder.vehicle?.plate}</p>
                  <p><strong>Marca/Modelo:</strong> {workOrder.vehicle?.brand} {workOrder.vehicle?.model}</p>
                  <p><strong>Año:</strong> {workOrder.vehicle?.year}</p>
                </div>
              </div>
            </div>

            {/* Detalles del servicio */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="text-brand-accent" size={18} />
                <h4 className="font-bold text-gray-800">Servicio</h4>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                <p className="font-semibold text-gray-800 mb-1">{workOrder.service?.name || 'Servicio General'}</p>
                <p className="text-sm text-gray-600">{workOrder.description}</p>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Mecánico:</strong> {workOrder.mechanic || 'No asignado'}</p>
                <p><strong>Estado:</strong>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                    workOrder.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    workOrder.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    workOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {workOrder.status === 'COMPLETED' ? 'Completado' :
                     workOrder.status === 'IN_PROGRESS' ? 'En Proceso' :
                     workOrder.status === 'CANCELLED' ? 'Cancelado' : 'Pendiente'}
                  </span>
                </p>
              </div>
            </div>

            {/* Insumos utilizados */}
            {workOrder.supplies && workOrder.supplies.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="text-brand-accent" size={18} />
                  <h4 className="font-bold text-gray-800">Insumos</h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left font-semibold text-gray-700 border-b">Descripción</th>
                        <th className="p-2 text-left font-semibold text-gray-700 border-b">Cant.</th>
                        <th className="p-2 text-left font-semibold text-gray-700 border-b">Precio</th>
                        <th className="p-2 text-left font-semibold text-gray-700 border-b">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workOrder.supplies.map((supply, index) => (
                        <tr key={supply.id || index} className="border-b border-gray-100">
                          <td className="p-2 text-gray-600">{supply.supply?.name || 'Insumo'}</td>
                          <td className="p-2 text-gray-600">{supply.quantity} {supply.supply?.unit || 'un'}</td>
                          <td className="p-2 text-gray-600">{formatCurrency(supply.supply?.price || '0')}</td>
                          <td className="p-2 text-gray-600 font-semibold">
                            {formatCurrency((parseFloat(supply.supply?.price || '0') * supply.quantity).toString())}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Totales */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end">
                <div className="w-full md:w-1/2 lg:w-1/3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impuestos:</span>
                      <span className="font-semibold">{formatCurrency(tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                    <span>TOTAL:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notas */}
            {workOrder.additionalNotes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="font-bold text-gray-800 mb-2">Notas</h5>
                <p className="text-sm text-gray-600">{workOrder.additionalNotes}</p>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center print:hidden">
          <div className="text-xs text-gray-500">
            <p>Factura generada el {new Date().toLocaleDateString('es-ES')}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-brand-accent text-white rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center gap-1.5"
            >
              <Printer size={16} />
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
