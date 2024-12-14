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
  return (
    <div className="space-y-4 mt-4">
      <div>
        <Label htmlFor="phoneNumber">{method} Account Number</Label>
        <Input
          id="phoneNumber"
          placeholder={`Enter your ${method} account number`}
          onChange={(e) => onDetailsChange({
            phoneNumber: e.target.value,
            transactionId: (document.getElementById("mobileTransactionId") as HTMLInputElement)?.value || "",
          })}
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