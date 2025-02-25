import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useState } from "react";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export const AuthDialog = ({ isOpen, onClose, defaultTab = "login" }: AuthDialogProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleRegistrationComplete = (email: string) => {
    setRegisteredEmail(email);
    setActiveTab("login");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "register");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to PharmaCare
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="mx-2">Login</TabsTrigger>
            <TabsTrigger value="register" className="mx-2">Register</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[60vh] px-6 py-4">
            <TabsContent value="login" className="mt-4">
              <LoginForm onSuccess={onClose} defaultEmail={registeredEmail} />
            </TabsContent>
            
            <TabsContent value="register" className="mt-4">
              <RegisterForm 
                onSuccess={() => {}} 
                onRegistrationComplete={handleRegistrationComplete}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};