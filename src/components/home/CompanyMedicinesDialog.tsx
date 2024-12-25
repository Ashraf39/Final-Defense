import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Medicine } from "@/types/medicine";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MedicineCard } from "./MedicineCard";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { addToCart, toggleLike } from "@/lib/medicines";

interface CompanyMedicinesDialogProps {
  companyId: string | null;
  companyName: string;
  onOpenChange: (open: boolean) => void;
}

export const CompanyMedicinesDialog = ({ 
  companyId, 
  companyName,
  onOpenChange 
}: CompanyMedicinesDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["company-medicines", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const medicinesRef = collection(db, "medicines");
      const medicinesQuery = query(medicinesRef, where("companyId", "==", companyId));
      const medicinesSnapshot = await getDocs(medicinesQuery);
      return medicinesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Medicine[];
    },
    enabled: !!companyId,
  });

  const handleLike = async (medicineId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to like medicines",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const isNowLiked = await toggleLike(user.uid, medicineId);
    toast({
      title: isNowLiked ? "Added to favorites" : "Removed from favorites",
      description: `Medicine has been ${isNowLiked ? "added to" : "removed from"} your favorites`,
    });
  };

  const handleAddToCart = async (medicine: Medicine) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    await addToCart(user.uid, medicine);
    toast({
      title: "Added to cart",
      description: "Medicine has been added to your cart",
    });
  };

  const handleBuy = (medicine: Medicine) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to purchase medicines",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    navigate("/checkout", {
      state: {
        singleItem: {
          medicineId: medicine.id,
          name: medicine.name,
          quantity: 1,
          price: medicine.price
        }
      }
    });
  };

  return (
    <Dialog open={!!companyId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="py-4">
          <h2 className="text-2xl font-bold mb-6">{companyName}'s Medicines</h2>
          {isLoading ? (
            <div className="text-center">Loading medicines...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {medicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  onLike={handleLike}
                  onAddToCart={handleAddToCart}
                  onBuy={handleBuy}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};