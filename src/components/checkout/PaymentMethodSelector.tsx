import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BankPaymentDetails } from "@/components/payment/BankPaymentDetails";

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchName: string;
  transactionId: string;
}

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  mobileMethod: string;
  onPaymentMethodChange: (method: string) => void;
  onMobileMethodChange: (method: string) => void;
  onBankDetailsChange: (details: BankDetails) => void;
}

export const PaymentMethodSelector = ({
  paymentMethod,
  mobileMethod,
  onPaymentMethodChange,
  onMobileMethodChange,
  onBankDetailsChange,
}: PaymentMethodSelectorProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
      <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange} className="space-y-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash">Cash on Delivery</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bank" id="bank" />
          <Label htmlFor="bank">Bank Transfer</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mobile" id="mobile" />
          <Label htmlFor="mobile">Mobile Banking</Label>
        </div>
      </RadioGroup>

      {paymentMethod === "bank" && (
        <BankPaymentDetails onDetailsChange={onBankDetailsChange} />
      )}

      {paymentMethod === "mobile" && (
        <div className="mt-4">
          <h3 className="font-medium mb-3">Select Mobile Banking Method</h3>
          <RadioGroup value={mobileMethod} onValueChange={onMobileMethodChange} className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bkash" id="bkash" />
              <Label htmlFor="bkash">Bkash</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nagad" id="nagad" />
              <Label htmlFor="nagad">Nagad</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rocket" id="rocket" />
              <Label htmlFor="rocket">Rocket</Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </Card>
  );
};