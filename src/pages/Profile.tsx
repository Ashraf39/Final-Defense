import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CompanyDetailsForm } from "@/components/company/CompanyDetailsForm";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const Profile = () => {
  const { user, userRole } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!userData) {
    return <div className="container mx-auto px-4 py-8">User not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {userRole === "company" ? (
        <CompanyDetailsForm initialData={userData} />
      ) : (
        <ProfileForm initialData={userData} />
      )}
    </div>
  );
};