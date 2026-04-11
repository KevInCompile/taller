import { formatCurrency } from '../../../helpers/helpers';
import '../css/ThermalReceipt.css';
import type { WorkOrder } from '../schemas/work-order.model';

interface ThermalReceiptData extends WorkOrder {
  name: string;
  address: string;
}

export default function ThermalReceipt({ data }: { data: ThermalReceiptData }) {
  const IVA = parseFloat(data.subtotal) * 0.19

  return (
    <div className="receipt-wrapper">
      <div id="thermal-receipt" className="receipt">
        <p className="center large bold">{data.name}</p>
        <p className="center small">{data.address}</p>
        <hr />

        <div className="row">
          <span>Fecha:</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="row">
          <span>Factura #:</span>
          <span>000-1</span>
        </div>
        <div className="row">
          <span>Cliente:</span>
          <span>{data.customer.firstName} {data.customer.lastName}</span>
        </div>
        <hr />

        <div className="row bold medium">
          <span>DESCRIPTION</span>
          <span>TOTAL</span>
        </div>
        <hr />


        {data.supplies.map(item => (
          <div key={item.id} className="row">
            <span className="desc">{item.supply?.name}</span>
            <span className="price">{item.supply?.price}</span>
          </div>
        ))}
        <hr />

        <div className="row">
          <span>Subtotal:</span>
          <span>{formatCurrency(data.subtotal)}</span>
        </div>
        <div className="row">
          <span>IVA (19%):</span>
          <span>{formatCurrency(IVA)}</span>
        </div>
        <div className="row bold large">
          <span>TOTAL</span>
          <span>{formatCurrency(data.total)}</span>
        </div>
        <div className="spacer" />
        <p className="center small">¡Gracias por tu compra!</p>
      </div>
    </div>
  );
}
