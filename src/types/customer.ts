export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  mileage: number;
  year: number;
  plate: string;
  color: string;
  type: 'CAR' | 'MOTORCYCLE';
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  workshopId: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  vehicles: Vehicle[];
  workOrders: any[]; // TODO
}

export interface CustomerCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}
