import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NavbarLogo } from "./navbar/NavbarLogo";
import { NavbarActions } from "./navbar/NavbarActions";

export const Navbar = () => {
  const { user } = useAuth();
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