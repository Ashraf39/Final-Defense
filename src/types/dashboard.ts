import { Medicine as BaseMedicine } from './medicine';

export interface DashboardData {
  totalProducts: number;
  monthlySales: number;
  activeCustomers: number;
  pendingOrders: number;
}

export interface Medicine extends BaseMedicine {
  sales?: number;
}

// Using the complete Order type from order.ts
export interface Order {
  id: string;
  userId: string;
  items: {
    medicineId: string;
    companyId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: string;
  createdAt: Date;
  paymentMethod: string;
  mobileMethod?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    transactionId: string;
  };
  customerInfo: {
    displayName: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  companyInfo?: {
    companyName: string;
    address: string;
    phoneNumber: string;
    email: string;
    companyLicense?: string;
  };
  invoiceNumber: string;
}