import { Order } from "@/types/order";
import { format } from "date-fns";

interface PrintableInvoiceProps {
  order: Order;
  companyMedicineIds?: string[];
}

export const PrintableInvoice = ({ order, companyMedicineIds }: PrintableInvoiceProps) => {
  // Filter items to only show medicines belonging to the company
  const displayItems = companyMedicineIds 
    ? order.items.filter((item) => companyMedicineIds.includes(item.medicineId))
    : order.items;

  return (
    <div className="p-8 bg-white" id="printable-invoice">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">INVOICE</h1>
        <p className="text-gray-600">#{order.invoiceNumber}</p>
        <p className="text-gray-600">{format(order.createdAt, "PPpp")}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
        <div className="space-y-1">
          <p>Name: {order.customerInfo.displayName}</p>
          <p>Email: {order.customerInfo.email}</p>
          <p>Phone: {order.customerInfo.phoneNumber}</p>
          <p>Address: {order.customerInfo.address}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Order Details</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Quantity</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.name}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">${item.price.toFixed(2)}</td>
                <td className="text-right py-2">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right py-2 font-semibold">Total:</td>
              <td className="text-right py-2 font-semibold">${order.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Payment Information</h2>
        <p>Method: {order.paymentMethod} {order.mobileMethod && `(${order.mobileMethod})`}</p>
        {order.bankDetails && (
          <div className="mt-2">
            <p>Bank: {order.bankDetails.bankName}</p>
            <p>Account: {order.bankDetails.accountNumber}</p>
            <p>Transaction ID: {order.bankDetails.transactionId}</p>
          </div>
        )}
      </div>
    </div>
  );
};