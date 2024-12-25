import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OrderCard } from "@/components/orders/OrderCard";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { OrderLoadingState } from "@/components/orders/OrderLoadingState";
import { OrderErrorState } from "@/components/orders/OrderErrorState";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface OrderDetailsDialogProps {
  invoiceNumber: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsDialog = ({ invoiceNumber, isOpen, onClose }: OrderDetailsDialogProps) => {
  const { data: order, isLoading, error } = useOrderDetails(invoiceNumber || undefined);
  const [companyMedicineIds, setCompanyMedicineIds] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCompanyMedicines = async () => {
      if (!user?.uid) return;
      
      try {
        const medicinesQuery = query(
          collection(db, "medicines"),
          where("companyId", "==", user.uid)
        );
        const medicinesSnapshot = await getDocs(medicinesQuery);
        const medicineIds = medicinesSnapshot.docs.map(doc => doc.id);
        setCompanyMedicineIds(medicineIds);
      } catch (error) {
        console.error("Error fetching company medicines:", error);
      }
    };

    fetchCompanyMedicines();
  }, [user?.uid]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details - Invoice #{invoiceNumber}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isLoading ? (
            <OrderLoadingState />
          ) : error ? (
            <OrderErrorState />
          ) : order ? (
            <OrderCard 
              order={order} 
              isCompany={true}
              companyMedicineIds={companyMedicineIds}
            />
          ) : (
            <OrderErrorState />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};