import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  mobileMethod: string;
  onPaymentMethodChange: (method: string) => void;
  onMobileMethodChange: (method: string) => void;
  onBankDetailsChange: (details: any) => void;
  onMobileDetailsChange: (details: any) => void;
}

export const PaymentMethodSelector = ({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentMethodSelectorProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
      <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange} className="space-y-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash">Cash on Delivery</Label>
        </div>
      </RadioGroup>
    </Card>
  );
};