import { Heart, ShoppingCart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Medicine } from "@/types/medicine";

interface MedicineActionButtonsProps {
  medicine: Medicine;
  isLikedByUser: boolean;
  onLike: () => void;
  onAddToCart: () => void;
  onBuy: () => void;
}

export const MedicineActionButtons = ({
  medicine,
  isLikedByUser,
  onLike,
  onAddToCart,
  onBuy,
}: MedicineActionButtonsProps) => {
  return (
    <div className="flex gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full hover:bg-pink-50"
        onClick={onLike}
      >
        <Heart 
          className={`h-5 w-5 ${isLikedByUser ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
        />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full hover:bg-blue-50"
        onClick={onAddToCart}
      >
        <ShoppingCart className="h-5 w-5 text-gray-500" />
      </Button>
      <Button
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-sm px-4 py-2 h-10 rounded-full flex-grow"
        onClick={onBuy}
      >
        <ShoppingBag className="h-5 w-5 mr-2" />
        Buy
      </Button>
    </div>
  );
};