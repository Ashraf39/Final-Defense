import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import { Medicine } from "@/types/medicine";
import { useState, useEffect } from "react";
import { isLiked } from "@/lib/medicines";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { MedicineDetailsDialog } from "@/components/dashboard/MedicineDetailsDialog";

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

  const handleLike = () => {
    handleAction(() => onLike(medicine.id));
  };

  const handleAddToCart = () => {
    handleAction(() => onAddToCart(medicine));
  };

  const handleBuy = () => {
    handleAction(() => onBuy(medicine));
  };

  return (
    <>
      <div 
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-[#D3E4FD] cursor-pointer w-full min-w-[280px] flex flex-col overflow-hidden group"
        onClick={() => setShowDetailsDialog(true)}
      >
        <div className="relative overflow-hidden">
          <img
            src={medicine.image || "/placeholder.svg"}
            alt={medicine.name}
            className="w-full h-36 sm:h-48 object-contain rounded-t-xl p-2 sm:p-3 bg-gradient-to-b from-[#F2FCE2] to-white transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="p-4 sm:p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-[#F1F0FB]/30" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3 truncate text-gray-800">{medicine.name}</h3>
          <div className="min-h-[2.5rem] sm:min-h-[3rem] mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{medicine.description}</p>
          </div>
          <div className="flex justify-center mb-3 sm:mb-4">
            <span className="text-base sm:text-lg font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">BDT {medicine.price}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto">
            <div className="flex gap-2 justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-pink-50 transition-colors flex-shrink-0"
                onClick={handleLike}
              >
                <Heart 
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${isLikedByUser ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-blue-50 transition-colors flex-shrink-0"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </Button>
            </div>
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90 text-white font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 h-9 sm:h-10 rounded-full flex-grow transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 whitespace-nowrap flex items-center justify-center gap-2 min-w-[120px]"
              onClick={handleBuy}
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="flex-shrink-0">Buy Now</span>
            </Button>
          </div>
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