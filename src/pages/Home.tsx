import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData } from "@/types/user";
import { Medicine } from "@/types/medicine";
import { getLikedMedicines, toggleLike, addToCart } from "@/lib/medicines";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchSection } from "@/components/home/SearchSection";
import { SearchResults } from "@/components/home/SearchResults";
import { CompanySection } from "@/components/home/CompanySection";
import { FavoritesSection } from "@/components/home/FavoritesSection";
import { useSearch } from "@/hooks/useSearch";

export const Home = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<UserData[]>([]);
  const [likedMedicines, setLikedMedicines] = useState<Medicine[]>([]);
  const { medicines: searchResults, companies: companyResults, isLoading } = useSearch(searchQuery);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const usersRef = collection(db, "users");
        const companyQuery = query(usersRef, where("role", "==", "company"));
        const companiesSnapshot = await getDocs(companyQuery);
        const companiesData = companiesSnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        } as UserData));
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    const fetchLikedMedicines = async () => {
      if (user) {
        const medicines = await getLikedMedicines(user.uid);
        setLikedMedicines(medicines);
      }
    };

    fetchCompanies();
    fetchLikedMedicines();
  }, [user]);

  const handleLike = async (medicineId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to like medicines",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const isNowLiked = await toggleLike(user.uid, medicineId);
    if (isNowLiked) {
      toast({
        title: "Added to favorites",
        description: "Medicine has been added to your favorites",
      });
    } else {
      toast({
        title: "Removed from favorites",
        description: "Medicine has been removed from your favorites",
      });
    }

    const medicines = await getLikedMedicines(user.uid);
    setLikedMedicines(medicines);
  };

  const handleAddToCart = async (medicine: Medicine) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    await addToCart(user.uid, medicine);
    toast({
      title: "Added to cart",
      description: "Medicine has been added to your cart",
    });
  };

  return (
    <div className="space-y-8 py-4">
      <HeroSection />
      <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <SearchResults 
        medicines={searchResults} 
        companies={companyResults} 
        isLoading={isLoading} 
      />
      <CompanySection companies={companies} />
      {user && (
        <FavoritesSection
          likedMedicines={likedMedicines}
          onLike={handleLike}
          onAddToCart={handleAddToCart}
          isAuthenticated={!!user}
        />
      )}
    </div>
  );
};