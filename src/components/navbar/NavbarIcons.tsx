import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Home, ShoppingCart, Package, User, ClipboardList, LayoutDashboard } from 'lucide-react';

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
    icon={<Home className="h-6 w-6" strokeWidth={1} stroke="black" />}
    tooltip="Home"
  />
);

export const CartIcon = ({ count = 0 }) => (
  <NavbarIcon
    to="/cart"
    icon={
      <div className="relative">
        <ShoppingCart className="h-6 w-6" strokeWidth={1} stroke="black" />
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
    icon={<ClipboardList className="h-6 w-6" strokeWidth={1} stroke="black" />}
    tooltip="Orders"
  />
);

export const DashboardIcon = () => (
  <NavbarIcon
    to="/dashboard"
    icon={<LayoutDashboard className="h-6 w-6" strokeWidth={1} stroke="black" />}
    tooltip="Dashboard"
  />
);

export const InventoryIcon = () => (
  <NavbarIcon
    to="/inventory"
    icon={<Package className="h-6 w-6" strokeWidth={1} stroke="black" />}
    tooltip="Inventory"
  />
);

export const CompanyIcon = () => (
  <NavbarIcon
    to="/dashboard"
    icon={<LayoutDashboard className="h-6 w-6" strokeWidth={1} stroke="black" />}
    tooltip="Company Dashboard"
  />
);