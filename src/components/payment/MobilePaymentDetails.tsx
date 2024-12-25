import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MobilePaymentDetailsProps {
  method: string;
  onDetailsChange: (details: {
    phoneNumber: string;
    transactionId: string;
  }) => void;
}

export const MobilePaymentDetails = ({ method, onDetailsChange }: MobilePaymentDetailsProps) => {
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 11) { // Standard mobile banking number length
      onDetailsChange({
        phoneNumber: value,
        transactionId: (document.getElementById("mobileTransactionId") as HTMLInputElement)?.value || "",
      });
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div>
        <Label htmlFor="phoneNumber">{method} Account Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          pattern="[0-9]*"
          placeholder={`Enter your ${method} account number`}
          onChange={handlePhoneNumberChange}
        />
      </div>
      <div>
        <Label htmlFor="mobileTransactionId">Transaction ID</Label>
        <Input
          id="mobileTransactionId"
          placeholder="Enter transaction ID"
          onChange={(e) => onDetailsChange({
            transactionId: e.target.value,
            phoneNumber: (document.getElementById("phoneNumber") as HTMLInputElement)?.value || "",
          })}
        />
      </div>
    </div>
  );
};