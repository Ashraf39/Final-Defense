import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface OrderItem {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  total: number;
  loading: boolean;
  onSubmit: () => void;
  disabled: boolean;
}

export const OrderSummary = ({ items, total, loading, onSubmit, disabled }: OrderSummaryProps) => {
  return (
    <>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Total:</p>
              <p className="font-semibold">${total.toFixed(2)}</p>
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