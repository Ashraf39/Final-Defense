import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import type { UserData } from "@/types/user";

export const RegisterForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"regular" | "company">("regular");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const displayName = formData.get("displayName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const companyName = role === "company" ? formData.get("companyName") as string : undefined;
    const companyDescription = role === "company" ? formData.get("companyDescription") as string : undefined;
    const companyLicense = role === "company" ? formData.get("companyLicense") as string : undefined;

    if (password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData: UserData = {
        uid: userCredential.user.uid,
        email,
        role,
        displayName,
        phoneNumber,
        address,
        profileImage: "", // Initialize with empty string
        ...(role === "company" && {
          companyName,
          companyDescription,
          companyLicense,
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userData);

      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RadioGroup
        defaultValue="regular"
        value={role}
        onValueChange={(value) => setRole(value as "regular" | "company")}
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
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          required
          placeholder="Enter your phone number"
        />
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

      {role === "company" && (
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
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Register"}
      </Button>
    </form>
  );
};