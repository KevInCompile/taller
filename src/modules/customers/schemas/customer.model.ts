export interface Orders {
  customers: Customer[];
}

export interface Customer {
    id:         string;
    firstName:  string;
    lastName:   string;
    email:      string;
    phone:      string;
    address:    string;
    workshopId: string;
    createdAt:  Date;
    updatedAt:  Date;
    notes:      null | string;
    vehicles:   Vehicle[];
    workOrders: WorkOrder[];
}

export interface Vehicle {
    id:      string;
    brand:   string;
    model:   string;
    mileage: number;
    year:    number;
    plate:   string;
    color:   string;
    type:    string;
}

export interface WorkOrder {
    id:              string;
    status:          string;
    priority:        string;
    workshopId:      string;
    customerId:      string;
    vehicleId:       string;
    serviceId:       string;
    mechanic:        string;
    description:     string;
    additionalNotes: string;
    subtotal:        string;
    total:           string;
    startDate:       Date;
    createdAt:       Date;
    updatedAt:       Date;
}
