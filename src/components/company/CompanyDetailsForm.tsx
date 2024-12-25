import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Building2, Link, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanyDetailsFormProps {
  initialData: {
    companyName?: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    companyLogo?: string;
    companyDescription?: string;
    companyLicense?: string;
  };
}

export const CompanyDetailsForm = ({ initialData }: CompanyDetailsFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    companyName: initialData.companyName || "",
    email: initialData.email,
    phoneNumber: initialData.phoneNumber || "",
    address: initialData.address || "",
    companyLogo: initialData.companyLogo || "",
    companyDescription: initialData.companyDescription || "",
    companyLicense: initialData.companyLicense || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      
      await updateDoc(userRef, {
        ...companyData,
        updatedAt: new Date(),
      });

      toast({
        title: "Company details updated successfully",
        duration: 2000,
      });
    } catch (error: any) {
      toast({
        title: "Error updating company details",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdateCompany} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            Company Information
          </CardTitle>
          <CardDescription>
            Update your company's profile and business details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyLogo" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Company Logo URL
              </Label>
              <Input
                id="companyLogo"
                name="companyLogo"
                placeholder="Enter logo image URL"
                value={companyData.companyLogo}
                onChange={handleInputChange}
              />
              {companyData.companyLogo && (
                <div className="mt-2">
                  <img
                    src={companyData.companyLogo}
                    alt="Company Logo Preview"
                    className="h-20 w-20 object-contain border rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">
                <Building2 className="h-4 w-4 inline mr-2" />
                Company Name
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={companyData.companyName}
                onChange={handleInputChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={companyData.email}
                onChange={handleInputChange}
                placeholder="Enter company email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={companyData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter company phone"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">
                <MapPin className="h-4 w-4 inline mr-2" />
                Business Address
              </Label>
              <Input
                id="address"
                name="address"
                value={companyData.address}
                onChange={handleInputChange}
                placeholder="Enter company address"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="companyDescription">Company Description</Label>
              <Textarea
                id="companyDescription"
                name="companyDescription"
                value={companyData.companyDescription}
                onChange={handleInputChange}
                placeholder="Enter company description"
                className="h-32"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="companyLicense">License Number</Label>
              <Input
                id="companyLicense"
                name="companyLicense"
                value={companyData.companyLicense}
                onChange={handleInputChange}
                placeholder="Enter company license number"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Company Details"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};