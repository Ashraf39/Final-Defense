import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OrderCard } from "@/components/orders/OrderCard";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { OrderLoadingState } from "@/components/orders/OrderLoadingState";
import { OrderErrorState } from "@/components/orders/OrderErrorState";

interface OrderDetailsDialogProps {
  invoiceNumber: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsDialog = ({ invoiceNumber, isOpen, onClose }: OrderDetailsDialogProps) => {
  const { data: order, isLoading } = useOrderDetails(invoiceNumber || undefined);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details - Invoice #{invoiceNumber}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isLoading ? (
            <OrderLoadingState />
          ) : !order ? (
            <OrderErrorState />
          ) : (
            <OrderCard order={order} isCompany={true} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};