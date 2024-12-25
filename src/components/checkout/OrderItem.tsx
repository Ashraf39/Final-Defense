import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";

interface OrderItemProps {
  name: string;
  quantity: number;
  price: number;
  onQuantityChange: (newQuantity: number) => void;
}

export const OrderItem = ({ name, quantity, price, onQuantityChange }: OrderItemProps) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <div className="flex items-center space-x-2 mt-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="h-8 w-8"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleIncrease}
            className="h-8 w-8"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="font-medium">BDT {(price * quantity).toFixed(2)}</p>
    </div>
  );
};
