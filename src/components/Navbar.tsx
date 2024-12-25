import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NavbarLogo } from "./navbar/NavbarLogo";
import { NavbarActions } from "./navbar/NavbarActions";

export const Navbar = () => {
  const { user, userRole } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [profileImage, setProfileImage] = useState<string | undefined>();

  useEffect(() => {
    if (user) {
      // Cart items listener
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

      // Profile/Company logo image listener
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          // Use companyLogo for company users, otherwise use profileImage
          const userData = doc.data();
          setProfileImage(
            userRole === "company" ? userData.companyLogo : userData.profileImage
          );
        }
      });

      return () => {
        unsubscribe();
        unsubscribeProfile();
      };
    } else {
      setCartCount(0);
      setProfileImage(undefined);
    }
  }, [user, userRole]);

  return (
    <nav className="bg-white/80 border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <NavbarLogo />
          <NavbarActions cartCount={cartCount} profileImage={profileImage} />
        </div>
      </div>
    </nav>
  );
};