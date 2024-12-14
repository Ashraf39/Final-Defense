import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Home, ShoppingCart, Package, User, LogOut, LayoutDashboard, Boxes } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Navbar = () => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [profileImage, setProfileImage] = useState<string | undefined>();

  useEffect(() => {
    if (user) {
      const cartQuery = query(
        collection(db, "cartItems"),
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(cartQuery, (snapshot) => {
        const totalQuantity = snapshot.docs.reduce((total, doc) => {
          return total + (doc.data().quantity || 0);
        }, 0);
        setCartCount(totalQuantity);
      });

      // Fetch user profile image
      const fetchProfileImage = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfileImage(userDoc.data().profileImage);
        }
      };
      fetchProfileImage();

      return () => unsubscribe();
    } else {
      setCartCount(0);
      setProfileImage(undefined);
    }
  }, [user]);

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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <Home className="h-5 w-5 text-gray-600" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Home</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <Home className="h-5 w-5 text-gray-600" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Home</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/cart">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:scale-110 transition-transform duration-200 relative"
                        >
                          <ShoppingCart className="h-5 w-5 text-gray-600" />
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-scale-in">
                              {cartCount}
                            </span>
                          )}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Shopping Cart</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/orders">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <Package className="h-5 w-5 text-gray-600" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Orders</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}

            {user && userRole === "company" && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/dashboard">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <LayoutDashboard className="h-5 w-5 text-gray-600" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Dashboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/inventory">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <Boxes className="h-5 w-5 text-gray-600" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Inventory</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/orders">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <Package className="h-5 w-5 text-gray-600" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Orders</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}

            {user && (
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