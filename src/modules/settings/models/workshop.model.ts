export interface WorkShop {
    id:        string;
    name:      string;
    address:   string;
    phone:     string;
    email:     string;
    logo:      string;
    active:    boolean;
    ownerId:   string;
    createdAt: Date;
    updatedAt: Date;
    nit:       string;
    owner:     Owner;
    services:  Service[];
    supplies:  Supply[];
}

export interface Owner {
    id:        string;
    firstName: string;
    lastName:  string;
    email:     string;
}

export interface Service {
    id:         string;
    name:       string;
    workshopId: string;
    createdAt:  Date;
    updatedAt:  Date;
}

export interface Supply {
    id:          string;
    name:        string;
    description: string;
    price:       string;
    stock:       number;
    workshopId:  string;
    createdAt:   Date;
    updatedAt:   Date;
}
