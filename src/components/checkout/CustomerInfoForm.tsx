import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          onFormDataChange({
            displayName: userData.displayName || "",
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
            address: userData.address || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user, onFormDataChange]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 11) { // Assuming Bangladesh phone numbers
      onFormDataChange({ phoneNumber: value });
    }
  };

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
            type="tel"
            value={userFormData.phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter 11-digit phone number"
            required
            pattern="[0-9]{11}"
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