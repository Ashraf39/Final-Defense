import { Order } from "@/types/order";
import { format } from "date-fns";

interface PrintableInvoiceProps {
  order: Order;
  companyMedicineIds?: string[];
}

export const PrintableInvoice = ({ order, companyMedicineIds }: PrintableInvoiceProps) => {
  // Filter items to only show medicines belonging to the company if companyMedicineIds is provided
  const displayItems = companyMedicineIds 
    ? order.items.filter((item) => companyMedicineIds.includes(item.medicineId))
    : order.items;

  return (
    <div className="p-8 bg-white" id="printable-invoice">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">INVOICE</h1>
        <div className="text-gray-600 mb-4">
          <p>Invoice #{order.invoiceNumber}</p>
          <p>{format(order.createdAt, "PPpp")}</p>
        </div>
      </div>

      {order.companyInfo && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Company Information</h2>
          <div className="space-y-1">
            <p><span className="font-medium">Company:</span> {order.companyInfo.companyName}</p>
            <p><span className="font-medium">Address:</span> {order.companyInfo.address}</p>
            <p><span className="font-medium">Phone:</span> {order.companyInfo.phoneNumber}</p>
            <p><span className="font-medium">Email:</span> {order.companyInfo.email}</p>
            {order.companyInfo.companyLicense && (
              <p><span className="font-medium">License No:</span> {order.companyInfo.companyLicense}</p>
            )}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
        <div className="space-y-1">
          <p><span className="font-medium">Name:</span> {order.customerInfo.displayName}</p>
          <p><span className="font-medium">Email:</span> {order.customerInfo.email}</p>
          <p><span className="font-medium">Phone:</span> {order.customerInfo.phoneNumber}</p>
          <p><span className="font-medium">Address:</span> {order.customerInfo.address}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Order Details</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Quantity</th>
              <th className="text-right py-2">Price (per box)</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.name}</td>
                <td className="text-right py-2">{item.quantity} box{item.quantity === 1 ? '' : 'es'}</td>
                <td className="text-right py-2">BDT {item.price.toFixed(2)}</td>
                <td className="text-right py-2">BDT {(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right py-2 font-semibold">Total:</td>
              <td className="text-right py-2 font-semibold">BDT {order.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Payment Information</h2>
        <div className="space-y-1">
          <p><span className="font-medium">Method:</span> {order.paymentMethod} {order.mobileMethod && `(${order.mobileMethod})`}</p>
          {order.bankDetails && (
            <>
              <p><span className="font-medium">Bank:</span> {order.bankDetails.bankName}</p>
              <p><span className="font-medium">Account:</span> {order.bankDetails.accountNumber}</p>
              <p><span className="font-medium">Transaction ID:</span> {order.bankDetails.transactionId}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};