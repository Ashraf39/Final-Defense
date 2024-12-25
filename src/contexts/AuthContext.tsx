import { createContext, useContext, useEffect, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setUser, setUserRole } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, setUserRole]);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const store = useAuthStore();
  const navigate = useNavigate();

  return {
    user: store.user,
    userRole: store.userRole,
    logout: async () => {
      const wasAdmin = store.userRole === 'admin';
      await auth.signOut();
      store.logout();
      if (wasAdmin) {
        navigate('/');
      }
    },
  };
};