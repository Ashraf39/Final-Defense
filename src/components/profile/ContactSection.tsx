import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactSectionProps {
  email: string;
  phoneNumber: string;
  address: string;
  onChange: (name: string, value: string) => void;
}

export const ContactSection = ({ email, phoneNumber, address, onChange }: ContactSectionProps) => {
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
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => onChange("phoneNumber", e.target.value)}
        />
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