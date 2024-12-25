import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CartSummaryProps {
  total: number;
  items: any[];
}

export const CartSummary = ({ total, items }: CartSummaryProps) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        items,
        total,
        source: 'cart'
      }
    });
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <span className="font-medium">Total:</span>
        <span className="text-xl font-bold">
          ${total.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
        <Button onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};