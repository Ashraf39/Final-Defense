import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface NameSectionProps {
  displayName: string;
  onChange: (name: string, value: string) => void;
}

export const NameSection = ({ displayName, onChange }: NameSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="displayName" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        Full Name
      </Label>
      <Input
        id="displayName"
        name="displayName"
        placeholder="Enter your name"
        value={displayName}
        onChange={(e) => onChange("displayName", e.target.value)}
      />
    </div>
  );
};