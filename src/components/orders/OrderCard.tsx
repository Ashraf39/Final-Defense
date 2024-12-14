import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { OrderStatusManager } from "./OrderStatusManager";

interface OrderCardProps {
  order: Order;
  isCompany: boolean;
  companyMedicineIds?: string[];
}

export const OrderCard = ({ order, isCompany, companyMedicineIds }: OrderCardProps) => {
  // Filter items to only show medicines belonging to the company if viewing as company
  const displayItems = isCompany
    ? order.items.filter((item) => companyMedicineIds?.includes(item.medicineId))
    : order.items;

  if (isCompany && displayItems.length === 0) return null;

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div>
          <p className="font-semibold">Invoice #{order.invoiceNumber}</p>
          <p className="text-sm text-gray-500">
            {format(order.createdAt, "PPpp")}
          </p>
        </div>
        <OrderStatusManager
          orderId={order.id}
          currentStatus={order.status}
          isCompany={isCompany}
        />
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
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
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
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};