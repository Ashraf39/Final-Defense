import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, ShoppingCart } from "lucide-react";

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
    <div className="flex flex-col gap-2 mt-auto">
      <div className="flex justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-pink-50"
          onClick={onLike}
        >
          <Heart 
            className={`h-4 w-4 ${isLikedByUser ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-blue-50"
          onClick={onAddToCart}
        >
          <ShoppingCart className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
      <Button
        size="sm"
        className="bg-accent hover:bg-accent/90 text-white text-xs px-3 py-1.5 h-8 rounded-full w-full flex items-center justify-center gap-1.5"
        onClick={onBuy}
      >
        <ShoppingBag className="h-4 w-4" />
        Buy Now
      </Button>
    </div>
  );
};