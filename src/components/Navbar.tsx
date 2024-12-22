import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  HomeIcon,
  CartIcon,
  OrdersIcon,
  DashboardIcon,
  InventoryIcon,
  CompanyIcon,
} from "./navbar/NavbarIcons";
import { UserMenu } from "./navbar/UserMenu";

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
    if (user) {
      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "company") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="bg-white/80 border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            onClick={handleHomeClick} 
            className="text-2xl font-bold text-primary hover:opacity-80 transition-all duration-300 font-serif tracking-wide"
          >
            PharmaCare
          </Link>

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
        </div>
      </div>
    </nav>
  );
};