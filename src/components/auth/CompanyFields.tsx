import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const CompanyFields = () => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          required
          placeholder="Enter company name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyDescription">Company Description</Label>
        <Input
          id="companyDescription"
          name="companyDescription"
          required
          placeholder="Enter company description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyLicense">License Number</Label>
        <Input
          id="companyLicense"
          name="companyLicense"
          required
          placeholder="Enter company license number"
        />
      </div>
    </>
  );
};