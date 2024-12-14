import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, ShoppingCart } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData } from "@/types/user";
import { Medicine } from "@/types/medicine";
import { getLikedMedicines, toggleLike, addToCart } from "@/lib/medicines";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<UserData[]>([]);
  const [likedMedicines, setLikedMedicines] = useState<Medicine[]>([]);

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

    // Refresh liked medicines
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

  const handleBuy = (medicineId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to purchase medicines",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate(`/medicine/${medicineId}`);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-400 text-white py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Your Health, Our Priority
          </h1>
          <p className="text-lg md:text-xl">
            Find and order medicines from trusted pharmaceutical companies
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 p-3 bg-white rounded-full shadow-lg border border-green-100">
            <Input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
            />
            <Button className="rounded-full bg-green-600 hover:bg-green-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Companies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {companies.map((company) => (
            <Link
              key={company.uid}
              to={`/company/${company.uid}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-green-100 group"
            >
              <img
                src={company.companyLogo || "/placeholder.svg"}
                alt={`${company.companyName} Logo`}
                className="w-16 h-16 mx-auto mb-3 object-contain"
              />
              <h3 className="text-lg font-medium text-center text-gray-800 group-hover:text-green-600">
                {company.companyName || "Company Name"}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Favorites Section */}
      {user && (
        <section className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Favorites</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {likedMedicines.map((medicine) => (
              <div key={medicine.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-green-100">
                <img
                  src={medicine.image || "/placeholder.svg"}
                  alt={medicine.name}
                  className="w-full h-32 object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <h3 className="text-base font-medium mb-1">{medicine.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{medicine.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-green-600">${medicine.price}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleLike(medicine.id)}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleAddToCart(medicine)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleBuy(medicine.id)}
                      >
                        Buy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};