import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface CustomerFormData {
  displayName: string;
  phoneNumber: string;
  address: string;
  email: string;
}

interface CustomerInfoFormProps {
  userFormData: CustomerFormData;
  onFormDataChange: (data: Partial<CustomerFormData>) => void;
}

export const CustomerInfoForm = ({ userFormData, onFormDataChange }: CustomerInfoFormProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="displayName">Full Name</Label>
          <Input
            id="displayName"
            value={userFormData.displayName}
            onChange={(e) => onFormDataChange({ displayName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={userFormData.email}
            onChange={(e) => onFormDataChange({ email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={userFormData.phoneNumber}
            onChange={(e) => onFormDataChange({ phoneNumber: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="address">Delivery Address</Label>
          <Input
            id="address"
            value={userFormData.address}
            onChange={(e) => onFormDataChange({ address: e.target.value })}
            required
          />
        </div>
      </div>
    </Card>
  );
};