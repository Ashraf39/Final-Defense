import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userRole = userDoc.data()?.role;

      // Redirect based on role
      if (userRole === "company") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

      toast({
        title: "Logged in successfully",
        duration: 2000,
      });
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === "auth/invalid-login-credentials") {
        toast({
          title: "Invalid credentials",
          description: "The email or password you entered is incorrect",
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Login failed",
          description: "An error occurred while trying to log in. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};