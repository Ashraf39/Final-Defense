import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Home, ShoppingCart, Package, User } from 'lucide-react';

interface NavbarIconProps {
  to: string;
  icon: React.ReactNode;
  tooltip: string;
}

const NavbarIcon = ({ to, icon, tooltip }: NavbarIconProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={to}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-green-50 transition-colors"
          >
            {icon}
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const HomeIcon = () => (
  <NavbarIcon
    to="/"
    icon={<Home height="6" width="6" strokeWidth="1" stroke="black" />}
    tooltip="Home"
  />
);

export const CartIcon = ({ count = 0 }) => (
  <NavbarIcon
    to="/cart"
    icon={
      <div className="relative">
        <ShoppingCart height="6" width="6" strokeWidth="1" stroke="black" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-scale-in">
            {count}
          </span>
        )}
      </div>
    }
    tooltip="Cart"
  />
);

export const OrdersIcon = () => (
  <NavbarIcon
    to="/orders"
    icon={<Package height="6" width="6" strokeWidth="1" stroke="black" />}
    tooltip="Orders"
  />
);

export const DashboardIcon = () => (
  <NavbarIcon
    to="/dashboard"
    icon={<User height="6" width="6" strokeWidth="1" stroke="black" />}
    tooltip="Dashboard"
  />
);

export const InventoryIcon = () => (
  <NavbarIcon
    to="/inventory"
    icon={<Package height="6" width="6" strokeWidth="1" stroke="black" />}
    tooltip="Inventory"
  />
);

export const CompanyIcon = () => (
  <NavbarIcon
    to="/dashboard"
    icon={<User height="6" width="6" strokeWidth="1" stroke="black" />}
    tooltip="Company Dashboard"
  />
);