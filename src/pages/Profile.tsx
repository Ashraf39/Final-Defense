import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword } from "firebase/auth";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Lock } from "lucide-react";

export const Profile = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    address: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      
      // Update user details in Firestore
      await updateDoc(userRef, {
        displayName: userData.displayName || user.displayName,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        updatedAt: new Date(),
      });

      // Update email if changed
      if (userData.email && userData.email !== user.email) {
        await updateEmail(user, userData.email);
        await updateDoc(userRef, { email: userData.email });
      }

      // Update password if provided
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

      // Clear password fields
      setUserData(prev => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));

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
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Update your profile information and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="displayName"
                  name="displayName"
                  placeholder={user?.displayName || "Enter your name"}
                  value={userData.displayName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={user?.email || "Enter your email"}
                  value={userData.email}
                  onChange={handleInputChange}
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
                  value={userData.phoneNumber}
                  onChange={handleInputChange}
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
                  value={userData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <Separator />

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
                  value={userData.newPassword}
                  onChange={handleInputChange}
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
                  value={userData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};