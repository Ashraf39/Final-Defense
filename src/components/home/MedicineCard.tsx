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
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-green-100 cursor-pointer w-full"
        onClick={() => setShowDetailsDialog(true)}
      >
        <img
          src={medicine.image || "/placeholder.svg"}
          alt={medicine.name}
          className="w-full h-36 sm:h-48 object-contain rounded-t-lg p-2 sm:p-3"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="p-2 sm:p-4" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2 truncate">{medicine.name}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{medicine.description}</p>
          <div className="flex justify-center mb-2 sm:mb-3">
            <span className="text-base sm:text-lg font-bold text-green-600">BDT {medicine.price}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex gap-2 justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-pink-50"
                onClick={handleLike}
              >
                <Heart 
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${isLikedByUser ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-blue-50"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </Button>
            </div>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 h-8 sm:h-10 rounded-full flex-grow"
              onClick={handleBuy}
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Buy
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