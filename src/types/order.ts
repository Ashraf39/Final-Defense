export interface OrderItem {
  medicineId: string;
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
  invoiceNumber: string;
}