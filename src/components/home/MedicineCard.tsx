import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import { Medicine } from "@/types/medicine";
import { useState, useEffect } from "react";
import { isLiked } from "@/lib/medicines";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";

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
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-green-100">
        <img
          src={medicine.image || "/placeholder.svg"}
          alt={medicine.name}
          className="w-full h-48 object-contain rounded-t-lg p-3"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="p-4">
          <h3 className="text-base font-medium mb-2 truncate">{medicine.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{medicine.description}</p>
          <div className="flex justify-center mb-3">
            <span className="text-lg font-bold text-green-600">BDT {medicine.price}</span>
          </div>
          <div className="flex justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-pink-50"
              onClick={handleLike}
            >
              <Heart 
                className={`h-5 w-5 ${isLikedByUser ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-blue-50"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 text-gray-500" />
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-sm px-4 py-2 h-10 rounded-full flex-grow"
              onClick={handleBuy}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Buy
            </Button>
          </div>
        </div>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
      />
    </>
  );
};