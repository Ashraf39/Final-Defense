import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BasicInfoFieldsProps {
  phoneNumber: string;
  onPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicInfoFields = ({ phoneNumber, onPhoneNumberChange }: BasicInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Create a password"
        />
        <Alert variant="default" className="bg-muted/50">
          <AlertDescription className="text-sm text-muted-foreground">
            Password must:
            <ul className="list-disc list-inside mt-1">
              <li>Be at least 6 characters long</li>
              <li>Contain both letters and numbers</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Full Name</Label>
        <Input
          id="displayName"
          name="displayName"
          required
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+88</span>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            required
            value={phoneNumber}
            onChange={onPhoneNumberChange}
            className="pl-12"
            placeholder="Enter 11 digits"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          required
          placeholder="Enter your address"
        />
      </div>
    </>
  );
};