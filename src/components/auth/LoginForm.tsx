import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSuccess?: () => void;
  defaultEmail?: string;
}

export const LoginForm = ({ onSuccess, defaultEmail }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(defaultEmail || "");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (defaultEmail) {
      setEmail(defaultEmail);
    }
  }, [defaultEmail]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userRole = userDoc.data()?.role;

      toast({
        title: "Logged in successfully",
        duration: 2000,
      });

      if (userRole === "company") {
        navigate("/dashboard");
      } else if (userRole === "admin") {
        navigate("/admin");
      }

      onSuccess?.();
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = "An error occurred while trying to log in. Please try again.";

      if (authError.code === "auth/invalid-login-credentials" || 
          authError.code === "auth/user-not-found" || 
          authError.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (authError.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="p-3"
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="p-3"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};