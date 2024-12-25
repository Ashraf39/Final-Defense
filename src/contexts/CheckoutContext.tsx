import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchName: string;
  transactionId: string;
}

interface CustomerInfo {
  displayName: string;
  phoneNumber: string;
  address: string;
  email: string;
}

interface OrderItem {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutContextType {
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  mobileMethod: string;
  bankDetails: BankDetails;
  customerInfo: CustomerInfo;
  setItems: (items: OrderItem[]) => void;
  setTotal: (total: number) => void;
  setPaymentMethod: (method: string) => void;
  setMobileMethod: (method: string) => void;
  setBankDetails: (details: BankDetails) => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  updateItemQuantity: (medicineId: string, quantity: number) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [mobileMethod, setMobileMethod] = useState("");
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: "",
    accountName: "",
    accountNumber: "",
    branchName: "",
    transactionId: "",
  });
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    displayName: "",
    phoneNumber: "",
    address: "",
    email: "",
  });

  const calculateTotal = (currentItems: OrderItem[]) => {
    return currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Initialize total when items are first set
  const handleSetItems = (newItems: OrderItem[]) => {
    setItems(newItems);
    const newTotal = calculateTotal(newItems);
    setTotal(newTotal);
  };

  const updateItemQuantity = (medicineId: string, quantity: number) => {
    const updatedItems = items.map(item =>
      item.medicineId === medicineId ? { ...item, quantity } : item
    );
    setItems(updatedItems);
    const newTotal = calculateTotal(updatedItems);
    setTotal(newTotal);
  };

  // Recalculate total whenever items change
  useEffect(() => {
    const newTotal = calculateTotal(items);
    setTotal(newTotal);
  }, [items]);

  return (
    <CheckoutContext.Provider
      value={{
        items,
        total,
        paymentMethod,
        mobileMethod,
        bankDetails,
        customerInfo,
        setItems: handleSetItems,
        setTotal,
        setPaymentMethod,
        setMobileMethod,
        setBankDetails,
        setCustomerInfo,
        updateItemQuantity,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};