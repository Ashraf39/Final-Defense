import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { OrderStatusManager } from "./OrderStatusManager";

interface OrderHeaderProps {
  invoiceNumber: string;
  createdAt: Date;
  orderId: string;
  currentStatus: string;
  isCompany: boolean;
  onPrint: () => void;
  onCancel: () => void;
}

export const OrderHeader = ({
  invoiceNumber,
  createdAt,
  orderId,
  currentStatus,
  isCompany,
  onPrint,
  onCancel,
}: OrderHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-4">
      <div>
        <p className="font-semibold">Invoice #{invoiceNumber}</p>
        <p className="text-sm text-gray-500">
          {format(createdAt, "PPpp")}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <OrderStatusManager
          orderId={orderId}
          currentStatus={currentStatus}
          isCompany={isCompany}
        />
        {isCompany && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
        )}
        {!isCompany && currentStatus !== "cancelled" && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onCancel}
          >
            Cancel Order
          </Button>
        )}
      </div>
    </div>
  );
};