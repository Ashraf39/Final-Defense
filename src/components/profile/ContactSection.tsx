import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactSectionProps {
  email: string;
  phoneNumber: string;
  address: string;
  onChange: (name: string, value: string) => void;
}

export const ContactSection = ({ email, phoneNumber, address, onChange }: ContactSectionProps) => {
  const { toast } = useToast();
  const [localPhoneNumber, setLocalPhoneNumber] = useState(phoneNumber.replace("+88", ""));

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setLocalPhoneNumber(value);
      
      if (value.length === 11) {
        if (validatePhoneNumber(value)) {
          onChange("phoneNumber", `+88${value}`);
        } else {
          toast({
            title: "Invalid phone number",
            description: "Phone number must be exactly 11 digits",
            variant: "destructive",
          });
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Phone Number
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+88</span>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            className="pl-12"
            placeholder="Enter 11 digits"
            value={localPhoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Address
        </Label>
        <Input
          id="address"
          name="address"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>
    </div>
  );
};