import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  HomeIcon,
  CartIcon,
  OrdersIcon,
  DashboardIcon,
  InventoryIcon,
} from "./NavbarIcons";
import { UserMenu } from "./UserMenu";
import { AuthDialog } from "../auth/AuthDialog";

interface NavbarActionsProps {
  cartCount: number;
  profileImage?: string;
}

export const NavbarActions = ({ cartCount, profileImage }: NavbarActionsProps) => {
  const { user, userRole, logout } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {!user && (
        <>
          <HomeIcon />
          <Button 
            className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
            onClick={() => setIsAuthDialogOpen(true)}
          >
            Login
          </Button>
          <AuthDialog 
            isOpen={isAuthDialogOpen} 
            onClose={() => setIsAuthDialogOpen(false)} 
          />
        </>
      )}

      {user && userRole === "regular" && (
        <>
          <HomeIcon />
          <CartIcon count={cartCount} />
          <OrdersIcon />
        </>
      )}

      {user && userRole === "company" && (
        <>
          <DashboardIcon />
          <InventoryIcon />
          <OrdersIcon />
        </>
      )}

      {user && (
        <UserMenu 
          profileImage={profileImage}
          userRole={userRole}
          onLogout={logout}
        />
      )}
    </div>
  );
};