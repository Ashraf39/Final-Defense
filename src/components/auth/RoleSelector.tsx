import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RoleSelectorProps {
  value: "regular" | "company";
  onChange: (value: "regular" | "company") => void;
}

export const RoleSelector = ({ value, onChange }: RoleSelectorProps) => {
  return (
    <RadioGroup
      defaultValue="regular"
      value={value}
      onValueChange={onChange}
      className="flex gap-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="regular" id="regular" />
        <Label htmlFor="regular">Regular User</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="company" id="company" />
        <Label htmlFor="company">Company</Label>
      </div>
    </RadioGroup>
  );
};