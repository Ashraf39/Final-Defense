import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmptyCart = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-4">Your cart is empty</p>
      <Button onClick={() => navigate("/")}>Continue Shopping</Button>
    </div>
  );
};