import { RegisterForm } from "@/components/auth/RegisterForm";

export const Register = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">
            Sign up to access all features
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};