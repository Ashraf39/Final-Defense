import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Medicine } from "@/types/medicine";

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
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl || imageUrl === "") return "/placeholder.svg";
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/")) return imageUrl;
    return `/placeholder.svg`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-green-100">
      <img
        src={getImageUrl(medicine.image)}
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
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-green-600">${medicine.price}</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onLike(medicine.id)}
            >
              <Heart className="h-3 w-3 fill-current" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onAddToCart(medicine)}
            >
              <ShoppingCart className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-6"
              onClick={() => onBuy(medicine)}
            >
              Buy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};