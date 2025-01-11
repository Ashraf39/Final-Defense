export interface OrderItem {
  medicineId: string;
  companyId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
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