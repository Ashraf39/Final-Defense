import { useState, useEffect } from "react";
import { Medicine } from "@/types/medicine";
import { isLiked } from "@/lib/medicines";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { MedicineDetailsDialog } from "@/components/dashboard/MedicineDetailsDialog";
import { MedicineImage } from "./medicine-card/MedicineImage";
import { MedicineDetails } from "./medicine-card/MedicineDetails";
import { MedicineCardActions } from "./medicine-card/MedicineCardActions";

interface MedicineCardProps {
  medicine: Medicine;
  onLike: (medicineId: string) => Promise<void>;
  onAddToCart: (medicine: Medicine) => Promise<void>;
  onBuy: (medicine: Medicine) => void;
}

export const MedicineCard = ({ 
  medicine, 
  onLike, 
  onAddToCart, 
  onBuy 
}: MedicineCardProps) => {
  const { user } = useAuth();
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (user) {
        const liked = await isLiked(user.uid, medicine.id);
        setIsLikedByUser(liked);
      }
    };
    
    checkIfLiked();
  }, [user, medicine.id]);

  const handleAction = async (action: () => void) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    action();
  };

  return (
    <>
      <div 
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-[#D3E4FD] cursor-pointer w-[214px] min-w-[214px] flex flex-col overflow-hidden group"
        onClick={() => setShowDetailsDialog(true)}
      >
        <MedicineImage image={medicine.image} name={medicine.name} />
        
        <div className="p-4 sm:p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-[#F1F0FB]/30" onClick={(e) => e.stopPropagation()}>
          <MedicineDetails 
            name={medicine.name}
            description={medicine.description}
            price={medicine.price}
          />
          
          <MedicineCardActions
            isLikedByUser={isLikedByUser}
            onLike={() => handleAction(() => onLike(medicine.id))}
            onAddToCart={() => handleAction(() => onAddToCart(medicine))}
            onBuy={() => handleAction(() => onBuy(medicine))}
          />
        </div>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
      />

      <MedicineDetailsDialog
        medicine={medicine}
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
      />
    </>
  );
};