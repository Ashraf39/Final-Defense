import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

interface SecuritySectionProps {
  newPassword: string;
  confirmPassword: string;
  onChange: (name: string, value: string) => void;
}

export const SecuritySection = ({ newPassword, confirmPassword, onChange }: SecuritySectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          New Password
        </Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => onChange("newPassword", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
        />
      </div>
    </div>
  );
};