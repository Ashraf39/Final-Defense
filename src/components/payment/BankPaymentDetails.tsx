import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BankPaymentDetailsProps {
  onDetailsChange: (details: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchName: string;
    transactionId: string;
  }) => void;
}

export const BankPaymentDetails = ({ onDetailsChange }: BankPaymentDetailsProps) => {
  return (
    <div className="space-y-4 mt-4">
      <div>
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          placeholder="Enter bank name"
          onChange={(e) => onDetailsChange({
            bankName: e.target.value,
            accountName: (document.getElementById("accountName") as HTMLInputElement)?.value || "",
            accountNumber: (document.getElementById("accountNumber") as HTMLInputElement)?.value || "",
            branchName: (document.getElementById("branchName") as HTMLInputElement)?.value || "",
            transactionId: (document.getElementById("transactionId") as HTMLInputElement)?.value || "",
          })}
        />
      </div>
      <div>
        <Label htmlFor="accountName">Account Holder Name</Label>
        <Input
          id="accountName"
          placeholder="Enter account holder name"
          onChange={(e) => onDetailsChange({
            accountName: e.target.value,
            bankName: (document.getElementById("bankName") as HTMLInputElement)?.value || "",
            accountNumber: (document.getElementById("accountNumber") as HTMLInputElement)?.value || "",
            branchName: (document.getElementById("branchName") as HTMLInputElement)?.value || "",
            transactionId: (document.getElementById("transactionId") as HTMLInputElement)?.value || "",
          })}
        />
      </div>
      <div>
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          placeholder="Enter account number"
          onChange={(e) => onDetailsChange({
            accountNumber: e.target.value,
            bankName: (document.getElementById("bankName") as HTMLInputElement)?.value || "",
            accountName: (document.getElementById("accountName") as HTMLInputElement)?.value || "",
            branchName: (document.getElementById("branchName") as HTMLInputElement)?.value || "",
            transactionId: (document.getElementById("transactionId") as HTMLInputElement)?.value || "",
          })}
        />
      </div>
      <div>
        <Label htmlFor="branchName">Branch Name</Label>
        <Input
          id="branchName"
          placeholder="Enter branch name"
          onChange={(e) => onDetailsChange({
            branchName: e.target.value,
            bankName: (document.getElementById("bankName") as HTMLInputElement)?.value || "",
            accountName: (document.getElementById("accountName") as HTMLInputElement)?.value || "",
            accountNumber: (document.getElementById("accountNumber") as HTMLInputElement)?.value || "",
            transactionId: (document.getElementById("transactionId") as HTMLInputElement)?.value || "",
          })}
        />
      </div>
      <div>
        <Label htmlFor="transactionId">Transaction ID</Label>
        <Input
          id="transactionId"
          placeholder="Enter transaction ID"
          onChange={(e) => onDetailsChange({
            transactionId: e.target.value,
            bankName: (document.getElementById("bankName") as HTMLInputElement)?.value || "",
            accountName: (document.getElementById("accountName") as HTMLInputElement)?.value || "",
            accountNumber: (document.getElementById("accountNumber") as HTMLInputElement)?.value || "",
            branchName: (document.getElementById("branchName") as HTMLInputElement)?.value || "",
          })}
        />
      </div>
    </div>
  );
};