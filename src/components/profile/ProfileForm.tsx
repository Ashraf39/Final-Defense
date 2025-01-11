import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword } from "firebase/auth";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileImageSection } from "./ProfileImageSection";
import { ContactSection } from "./ContactSection";
import { SecuritySection } from "./SecuritySection";

interface ProfileFormProps {
  initialData: {
    displayName?: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    profileImage?: string;
  };
}

export const ProfileForm = ({ initialData }: ProfileFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    displayName: initialData.displayName || "",
    email: initialData.email,
    phoneNumber: initialData.phoneNumber?.replace("+88", "") || "",
    address: initialData.address || "",
    profileImage: initialData.profileImage || "",
    newPassword: "",
    confirmPassword: "",
  });

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (name: string, value: string) => {
    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 11) {
        setUserData(prev => ({
          ...prev,
          [name]: numericValue
        }));
      }
      return;
    }

    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validatePhoneNumber(userData.phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Phone number must be exactly 11 digits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      
      await updateDoc(userRef, {
        ...userData,
        phoneNumber: `+88${userData.phoneNumber}`,
        updatedAt: new Date(),
      });

      if (userData.email && userData.email !== user.email) {
        await updateEmail(user, userData.email);
        await updateDoc(userRef, { email: userData.email });
      }

      if (userData.newPassword) {
        if (userData.newPassword !== userData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (userData.newPassword.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        await updatePassword(user, userData.newPassword);
      }

      toast({
        title: "Profile updated successfully",
        duration: 2000,
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-8">
      <ProfileImageSection 
        profileImage={userData.profileImage}
        onChange={(value) => handleInputChange("profileImage", value)}
      />

      <div className="space-y-2">
        <label htmlFor="displayName" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Full Name
        </label>
        <input
          id="displayName"
          name="displayName"
          className="w-full p-2 border rounded"
          placeholder="Enter your name"
          value={userData.displayName}
          onChange={(e) => handleInputChange("displayName", e.target.value)}
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
            value={userData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            className="pl-12"
            placeholder="Enter 11 digits"
          />
        </div>
      </div>

      <ContactSection
        email={userData.email}
        phoneNumber={userData.phoneNumber}
        address={userData.address}
        onChange={handleInputChange}
      />

      <SecuritySection
        newPassword={userData.newPassword}
        confirmPassword={userData.confirmPassword}
        onChange={handleInputChange}
      />

      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
};
