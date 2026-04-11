import { X, Printer, FileText } from 'lucide-react';
import { useAuthStore } from '../../../../store/useAuthStore';
import type { WorkOrder } from '../../schemas/work-order.model';
import ThermalReceipt from '../ThermalReceipt';
import { useRef } from 'react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder | null;
  workshop?: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    nit?: string;
  };
}

export const InvoiceModal = ({ isOpen, onClose, workOrder, workshop: propWorkshop }: InvoiceModalProps) => {
  const authWorkshop = useAuthStore(state => state.workshop);
  const workshop = propWorkshop || authWorkshop;
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!receiptRef.current) return;

    const receiptElement = receiptRef.current.querySelector('#thermal-receipt');
    if (!receiptElement) return;

    // Obtener el HTML del recibo
    const receiptHtml = receiptElement.outerHTML;
    
    // Estilos CSS específicos para impresión térmica
    const thermalStyles = `
      /* ── Contenedor visible en pantalla ── */
      .receipt-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        background: #f0f0f0;
        min-height: 100vh;
      }

      .receipt {
        width: 72mm;           /* 80mm - márgenes */
        font-family: 'Courier New', monospace;
        font-size: 10pt;      /* pt, no px — más fiel al papel */
        line-height: 1.4;
        color: #000;
        background: #fff;
        padding: 4mm 4mm;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }

      /* ── Utilitarios de layout ── */
      .receipt .center  { text-align: center; }
      .receipt .bold    { font-weight: bold; }
      .receipt .small   { font-size: 8pt; }
      .receipt .large   { font-size: 13pt; }

      .receipt .row {
        display: flex;
        justify-content: space-between;
        gap: 4px;
      }
      .receipt .row .desc {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .receipt .row .price {
        text-align: right;
        white-space: nowrap;
      }

      .receipt hr {
        border: none;
        border-top: 1px dashed #555;
        margin: 3mm 0;
      }
      .receipt .spacer { height: 3mm; }
    `;

    // Crear una nueva ventana para imprimir
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) {
      alert('Por favor, permite ventanas emergentes para imprimir');
      return;
    }

    // Escribir el contenido en la nueva ventana
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Factura - Orden ${workOrder?.id.slice(-8).toUpperCase() || ''}</title>
          <style>
            @media print {
              body { 
                margin: 0 !important; 
                padding: 0 !important; 
                background: white !important;
              }
              @page { 
                margin: 0 !important; 
                size: 80mm auto !important;
              }
              .receipt-wrapper {
                padding: 0 !important;
                background: white !important;
                min-height: auto !important;
              }
              .receipt {
                box-shadow: none !important;
                width: 80mm !important;
              }
            }
            
            ${thermalStyles}
            
            body {
              margin: 0;
              padding: 0;
              background: #f0f0f0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            
            .print-container {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
            }
            
            /* Ocultar todo excepto el recibo durante impresión */
            @media print {
              body * {
                visibility: hidden;
              }
              .print-container, .print-container * {
                visibility: visible;
              }
              .print-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${receiptHtml}
          </div>
          <script>
            // Esperar a que se carguen los estilos
            setTimeout(() => {
              window.print();
              // Cerrar la ventana después de imprimir
              setTimeout(() => {
                window.close();
              }, 500);
            }, 100);
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  if (!isOpen) return null;
  if (!workOrder) return <></>

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
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
              onClick={handlePrint}
              className="px-3 py-1.5 bg-brand-accent text-white rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center gap-1.5"
            >
              <Printer size={16} />
              Imprimir
            </button>
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
        <div ref={receiptRef}>
          <ThermalReceipt data={{
            ...workOrder,
            name: workshop?.name || 'Taller',
            address: workshop?.address || 'Dirección no especificada'
          }} />
        </div>
      </div>
    </div>
  );
};
