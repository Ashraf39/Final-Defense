import { Order } from "@/types/order";
import { Card } from "@/components/ui/card";
import { updateOrderStatus } from "@/lib/orders";
import { useToast } from "@/hooks/use-toast";
import { PrintableInvoice } from "./PrintableInvoice";
import { OrderHeader } from "./OrderHeader";
import { CustomerInfo } from "./CustomerInfo";
import { OrderItems } from "./OrderItems";
import { PaymentDetails } from "./PaymentDetails";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface OrderCardProps {
  order: Order;
  isCompany: boolean;
  companyMedicineIds?: string[];
}

export const OrderCard = ({ order, isCompany, companyMedicineIds }: OrderCardProps) => {
  const { toast } = useToast();
  const [companyInfo, setCompanyInfo] = useState(order.companyInfo);
  
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (!order.items[0]?.companyId) return;
      
      try {
        const companyDoc = await getDoc(doc(db, "users", order.items[0].companyId));
        if (companyDoc.exists()) {
          const data = companyDoc.data();
          setCompanyInfo({
            companyName: data.companyName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            email: data.email,
            companyLicense: data.companyLicense
          });
        }
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };

    if (!order.companyInfo) {
      fetchCompanyInfo();
    }
  }, [order]);
  
  const displayItems = isCompany
    ? order.items.filter((item) => companyMedicineIds?.includes(item.medicineId))
    : order.items;

  if (isCompany && displayItems.length === 0) return null;

  const handleCancelOrder = async () => {
    try {
      await updateOrderStatus(order.id, "cancelled");
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-invoice');
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const orderWithCompanyInfo = {
    ...order,
    companyInfo: companyInfo
  };

  return (
    <>
      <Card className="p-6">
        <OrderHeader
          invoiceNumber={order.invoiceNumber}
          createdAt={order.createdAt}
          orderId={order.id}
          currentStatus={order.status}
          isCompany={isCompany}
          onPrint={handlePrint}
          onCancel={handleCancelOrder}
        />

        {isCompany && (
          <CustomerInfo
            displayName={order.customerInfo.displayName}
            email={order.customerInfo.email}
            phoneNumber={order.customerInfo.phoneNumber}
            address={order.customerInfo.address}
          />
        )}

        <OrderItems items={displayItems} />

        <PaymentDetails
          paymentMethod={order.paymentMethod}
          mobileMethod={order.mobileMethod}
          bankDetails={order.bankDetails}
          total={order.total}
        />
      </Card>

      <div className="hidden">
        <PrintableInvoice 
          order={orderWithCompanyInfo} 
          companyMedicineIds={companyMedicineIds} 
        />
      </div>
    </>
  );
};