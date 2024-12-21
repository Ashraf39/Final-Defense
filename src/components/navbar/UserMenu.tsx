import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserMenuProps {
  profileImage?: string;
  userRole?: string;
  onLogout: () => void;
}

export const UserMenu = ({ profileImage, userRole, onLogout }: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost"
          size="icon"
          className="hover:scale-110 transition-transform duration-200"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={profileImage} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 animate-in slide-in-from-top-2 duration-200">
        {userRole !== "admin" && (
          <DropdownMenuItem asChild>
            <Link to="/profile" className="w-full cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>
        )}
        {userRole === "company" && (
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="w-full cursor-pointer">
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={onLogout}
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};