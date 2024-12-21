import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  ShoppingBag,
  Package,
  LayoutDashboard,
  Boxes,
  Store
} from "lucide-react";

interface NavbarIconProps {
  to: string;
  icon: React.ReactNode;
  tooltip: string;
  className?: string;
}

export const NavbarIcon = ({ to, icon, tooltip, className = "" }: NavbarIconProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={to}>
          <Button 
            variant="ghost" 
            size="icon"
            className={`hover:scale-110 transition-transform duration-200 ${className}`}
          >
            {icon}
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const HomeIcon = () => (
  <NavbarIcon
    to="/"
    icon={<Home className="h-6 w-6 text-green-600 hover:text-green-700" strokeWidth={1.5} />}
    tooltip="Home"
  />
);

export const CartIcon = ({ count }: { count: number }) => (
  <NavbarIcon
    to="/cart"
    icon={
      <div className="relative">
        <ShoppingBag className="h-6 w-6 text-green-600 hover:text-green-700" strokeWidth={1.5} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-scale-in">
            {count}
          </span>
        )}
      </div>
    }
    tooltip="Shopping Cart"
  />
);

export const OrdersIcon = () => (
  <NavbarIcon
    to="/orders"
    icon={<Package className="h-6 w-6 text-green-600 hover:text-green-700" strokeWidth={1.5} />}
    tooltip="Orders"
  />
);

export const DashboardIcon = () => (
  <NavbarIcon
    to="/dashboard"
    icon={<LayoutDashboard className="h-6 w-6 text-green-600 hover:text-green-700" strokeWidth={1.5} />}
    tooltip="Dashboard"
  />
);

export const InventoryIcon = () => (
  <NavbarIcon
    to="/inventory"
    icon={<Boxes className="h-6 w-6 text-green-600 hover:text-green-700" strokeWidth={1.5} />}
    tooltip="Inventory"
  />
);

export const CompanyIcon = () => (
  <NavbarIcon
    to="/dashboard"
    icon={<Store className="h-6 w-6 text-green-600 hover:text-green-700" strokeWidth={1.5} />}
    tooltip="Company Dashboard"
  />
);