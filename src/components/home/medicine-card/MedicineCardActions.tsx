import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import { Medicine } from "@/types/medicine";

interface MedicineCardActionsProps {
  isLikedByUser: boolean;
  onLike: () => void;
  onAddToCart: () => void;
  onBuy: () => void;
}

export const MedicineCardActions = ({
  isLikedByUser,
  onLike,
  onAddToCart,
  onBuy,
}: MedicineCardActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto">
      <div className="flex gap-2 justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-pink-50 transition-colors flex-shrink-0"
          onClick={onLike}
        >
          <Heart 
            className={`h-4 w-4 sm:h-5 sm:w-5 ${isLikedByUser ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-blue-50 transition-colors flex-shrink-0"
          onClick={onAddToCart}
        >
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
        </Button>
      </div>
      <Button
        size="sm"
        className="bg-accent hover:bg-accent/90 text-white font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 h-9 sm:h-10 rounded-full flex-grow transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 whitespace-nowrap flex items-center justify-center gap-2 min-w-[120px]"
        onClick={onBuy}
      >
        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
        <span className="flex-shrink-0">Buy Now</span>
      </Button>
    </div>
  );
};