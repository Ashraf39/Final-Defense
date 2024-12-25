import { createContext, useContext, ReactNode, useState } from "react";
import { useCheckoutCalculations } from "@/hooks/useCheckoutCalculations";
import { OrderItem } from "@/types/order";

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

interface CheckoutContextType {
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  mobileMethod: string;
  bankDetails: BankDetails;
  customerInfo: CustomerInfo;
  setItems: (items: OrderItem[]) => void;
  setPaymentMethod: (method: string) => void;
  setMobileMethod: (method: string) => void;
  setBankDetails: (details: BankDetails) => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  updateItemQuantity: (medicineId: string, quantity: number) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const { items, setItems, total, updateItemQuantity } = useCheckoutCalculations([]);
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

  return (
    <CheckoutContext.Provider
      value={{
        items,
        total,
        paymentMethod,
        mobileMethod,
        bankDetails,
        customerInfo,
        setItems,
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