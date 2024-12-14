export interface DashboardData {
  totalProducts: number;
  monthlySales: number;
  activeCustomers: number;
  pendingOrders: number;
}

export interface Medicine {
  id: string;
  name: string;
  sales?: number;
  companyId: string;
  price: number;
  description: string;
  stock: number;
}

export interface Order {
  id: string;
  total: number;
  status: string;
  userId: string;
  createdAt: Date;
  items: {
    medicineId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}