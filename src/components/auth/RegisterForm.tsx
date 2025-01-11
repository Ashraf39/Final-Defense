import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { UserData } from "@/types/user";
import { RoleSelector } from "./RoleSelector";
import { BasicInfoFields } from "./BasicInfoFields";
import { CompanyFields } from "./CompanyFields";

interface RegisterFormProps {
  onSuccess?: () => void;
  onRegistrationComplete?: (email: string) => void;
}

export const RegisterForm = ({ onSuccess, onRegistrationComplete }: RegisterFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"regular" | "company">("regular");
  const [phoneNumber, setPhoneNumber] = useState("");

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= 6 && hasLetter && hasNumber;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setPhoneNumber(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const displayName = formData.get("displayName") as string;
    const address = formData.get("address") as string;
    const companyName = role === "company" ? formData.get("companyName") as string : undefined;
    const companyDescription = role === "company" ? formData.get("companyDescription") as string : undefined;
    const companyLicense = role === "company" ? formData.get("companyLicense") as string : undefined;

    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Phone number must be exactly 11 digits",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long and contain both letters and numbers",
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
        phoneNumber: `+88${phoneNumber}`,
        address,
        profileImage: "",
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
        description: "Please login with your credentials.",
      });

      await auth.signOut();
      
      if (onRegistrationComplete) {
        onRegistrationComplete(email);
      }
      
      onSuccess?.();
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
      <RoleSelector value={role} onChange={(value) => setRole(value as "regular" | "company")} />
      
      <BasicInfoFields
        phoneNumber={phoneNumber}
        onPhoneNumberChange={handlePhoneNumberChange}
      />

      {role === "company" && <CompanyFields />}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Register"}
      </Button>
    </form>
  );
};