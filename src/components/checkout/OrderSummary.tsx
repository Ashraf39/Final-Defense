import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { OrderItem } from "./OrderItem";

interface OrderItemType {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  items: OrderItemType[];
  total: number;
  loading: boolean;
  onSubmit: () => void;
  disabled: boolean;
  onQuantityChange: (medicineId: string, quantity: number) => void;
}

export const OrderSummary = ({ 
  items, 
  total, 
  loading, 
  onSubmit, 
  disabled,
  onQuantityChange 
}: OrderSummaryProps) => {
  // Calculate the total directly from items to ensure accuracy
  const calculatedTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <OrderItem
              key={item.medicineId}
              name={item.name}
              quantity={item.quantity}
              price={item.price}
              onQuantityChange={(newQuantity) => onQuantityChange(item.medicineId, newQuantity)}
            />
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Total:</p>
              <p className="font-semibold">BDT {calculatedTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Button
        className="w-full mt-6"
        onClick={onSubmit}
        disabled={disabled || loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Place Order"
        )}
      </Button>
    </>
  );
};