import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { updateOrderStatus, processOrder } from "@/lib/orders";

interface OrderStatusManagerProps {
  orderId: string;
  currentStatus: string;
  isCompany: boolean;
}

export const OrderStatusManager = ({ orderId, currentStatus, isCompany }: OrderStatusManagerProps) => {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      if (newStatus === "processing") {
        await processOrder(orderId);
      } else {
        await updateOrderStatus(orderId, newStatus);
      }
      setStatus(newStatus);
      toast({
        title: "Order status updated",
        description: `Order status has been changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating order status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isCompany) {
    return <Badge variant="outline">{status}</Badge>;
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={status}
        onValueChange={handleStatusUpdate}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};