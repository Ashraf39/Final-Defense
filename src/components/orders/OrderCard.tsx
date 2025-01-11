import { Order } from "@/types/order";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { OrderStatusManager } from "./OrderStatusManager";
import { updateOrderStatus } from "@/lib/orders";
import { useToast } from "@/hooks/use-toast";
import { PrintableInvoice } from "./PrintableInvoice";
import { Printer } from "lucide-react";

interface OrderCardProps {
  order: Order;
  isCompany: boolean;
  companyMedicineIds?: string[];
}

export const OrderCard = ({ order, isCompany, companyMedicineIds }: OrderCardProps) => {
  const { toast } = useToast();
  
  // Filter items to only show medicines belonging to the company if viewing as company
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
      window.location.reload(); // Reload the page to restore all functionality
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <p className="font-semibold">Invoice #{order.invoiceNumber}</p>
            <p className="text-sm text-gray-500">
              {format(order.createdAt, "PPpp")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <OrderStatusManager
              orderId={order.id}
              currentStatus={order.status}
              isCompany={isCompany}
            />
            {isCompany && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Invoice
              </Button>
            )}
            {!isCompany && order.status !== "cancelled" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancelOrder}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {isCompany && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Customer Information</h3>
            <p>Name: {order.customerInfo.displayName}</p>
            <p>Email: {order.customerInfo.email}</p>
            <p>Phone: {order.customerInfo.phoneNumber}</p>
            <p>Address: {order.customerInfo.address}</p>
          </div>
        )}

        <div className="space-y-3">
          {displayItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity} box{item.quantity === 1 ? '' : 'es'}</p>
              </div>
              <p className="font-medium">BDT {(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Payment Method</p>
              <p className="text-sm text-gray-600">
                {order.paymentMethod}
                {order.mobileMethod && ` (${order.mobileMethod})`}
              </p>
              {order.bankDetails && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Bank: {order.bankDetails.bankName}</p>
                  <p>Account: {order.bankDetails.accountNumber}</p>
                  <p>Transaction ID: {order.bankDetails.transactionId}</p>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold">
                BDT {order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="hidden">
        <PrintableInvoice order={order} companyMedicineIds={companyMedicineIds} />
      </div>
    </>
  );
};