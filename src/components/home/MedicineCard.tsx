import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import { Medicine } from "@/types/medicine";
import { useState, useEffect } from "react";
import { isLiked } from "@/lib/medicines";
import { useAuth } from "@/contexts/AuthContext";

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

  useEffect(() => {
    const checkIfLiked = async () => {
      if (user) {
        const liked = await isLiked(user.uid, medicine.id);
        setIsLikedByUser(liked);
      }
    };
    
    checkIfLiked();
  }, [user, medicine.id]);

  const handleLike = async () => {
    await onLike(medicine.id);
    setIsLikedByUser(!isLikedByUser);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-green-100">
      <img
        src={medicine.image || "/placeholder.svg"}
        alt={medicine.name}
        className="w-full h-24 object-cover rounded-t-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg";
        }}
      />
      <div className="p-2">
        <h3 className="text-sm font-medium mb-1 truncate">{medicine.name}</h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{medicine.description}</p>
        <div className="flex justify-center mb-2">
          <span className="text-sm font-bold text-green-600">BDT {medicine.price}</span>
        </div>
        <div className="flex justify-between gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-pink-50"
            onClick={handleLike}
          >
            <Heart 
              className={`h-4 w-4 ${isLikedByUser ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-blue-50"
            onClick={() => onAddToCart(medicine)}
          >
            <ShoppingCart className="h-4 w-4 text-gray-500" />
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1 h-8 rounded-full flex-grow"
            onClick={() => onBuy(medicine)}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Buy
          </Button>
        </div>
      </div>
    </div>
  );
};