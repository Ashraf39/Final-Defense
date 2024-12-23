import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  HomeIcon,
  CartIcon,
  OrdersIcon,
  DashboardIcon,
  InventoryIcon,
  CompanyIcon,
} from "./NavbarIcons";
import { UserMenu } from "./UserMenu";

interface NavbarActionsProps {
  cartCount: number;
  profileImage?: string;
}

export const NavbarActions = ({ cartCount, profileImage }: NavbarActionsProps) => {
  const { user, userRole, logout } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {!user && (
        <>
          <HomeIcon />
          <Link to="/login">
            <Button 
              className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
            >
              Login
            </Button>
          </Link>
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
          <CompanyIcon />
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