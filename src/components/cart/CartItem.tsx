import { Button } from "@/components/ui/button";
import { Trash2, MinusCircle, PlusCircle } from "lucide-react";

interface CartItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
}

export const CartItem = ({
  id,
  name,
  image,
  price,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex items-center space-x-4">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-gray-600">BDT {price.toFixed(2)} per box</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(id, quantity - 1)}
            disabled={quantity <= 1}
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity} box{quantity === 1 ? '' : 'es'}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(id, quantity + 1)}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onRemove(id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};