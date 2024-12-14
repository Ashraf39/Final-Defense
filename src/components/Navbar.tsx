import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, ShoppingCart, Package, User, LogOut, LayoutDashboard } from "lucide-react";

export const Navbar = () => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user && userRole === "company") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/80">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            onClick={handleHomeClick} 
            className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            PharmaCare
          </Link>

          <div className="flex items-center gap-2">
            {!user && (
              <>
                <Link to="/">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:scale-110 transition-transform duration-200"
                  >
                    <Home className="h-5 w-5 text-gray-600" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 transition-colors duration-200 hover:scale-105"
                  >
                    Login
                  </Button>
                </Link>
              </>
            )}

            {user && userRole === "regular" && (
              <>
                <Link to="/">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:scale-110 transition-transform duration-200"
                  >
                    <Home className="h-5 w-5 text-gray-600" />
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:scale-110 transition-transform duration-200 relative"
                  >
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      0
                    </span>
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:scale-110 transition-transform duration-200"
                  >
                    <Package className="h-5 w-5 text-gray-600" />
                  </Button>
                </Link>
              </>
            )}

            {user && userRole === "company" && (
              <Link to="/dashboard">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <LayoutDashboard className="h-5 w-5 text-gray-600" />
                </Button>
              </Link>
            )}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:scale-110 transition-transform duration-200"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-in slide-in-from-top-2 duration-200">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {userRole === "company" && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="w-full cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};