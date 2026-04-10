export type WorkOrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type WorkOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface WorkOrderCustomer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

export interface WorkOrderVehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  mileage: number;
  year: number;
  color: string;
  type?: string;
}

export interface WorkOrderService {
  id: string;
  name: string;
  description?: string;
  basePrice?: number;
}

export interface WorkOrderSupplyDetail {
  id: string;
  name: string;
  price: string;
  unit?: string;
}

export interface WorkOrderSupplyItem {
  id?: string;
  workOrderId?: string;
  supplyId: string;
  quantity: number;
  createdAt?: string;
  supply?: WorkOrderSupplyDetail;
}

export interface WorkOrder {
  id: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  workshopId: string;
  customerId: string;
  vehicleId: string;
  serviceId: string;
  mechanic: string;
  description: string;
  additionalNotes: string;
  subtotal: string;
  total: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
  customer: WorkOrderCustomer;
  vehicle: WorkOrderVehicle;
  service: WorkOrderService;
  supplies: WorkOrderSupplyItem[];
}

export interface Service {
  id: string;
  name: string;
  workshopId: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  basePrice?: number;
}

export interface Supply {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  workshopId: string;
  createdAt: string;
  updatedAt: string;
  unit?: string;
}