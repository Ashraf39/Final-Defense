import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Medicine } from "@/types/medicine";
import { toggleLike, addToCart, isLiked } from "@/lib/medicines";

export const CompanyMedicines = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [likedMedicines, setLikedMedicines] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const medicinesRef = collection(db, "medicines");
        const medicinesQuery = query(medicinesRef, where("companyId", "==", id));
        const medicinesSnapshot = await getDocs(medicinesQuery);
        const medicinesData = medicinesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Medicine[];
        setMedicines(medicinesData);

        // Fetch liked status for each medicine if user is logged in
        if (user) {
          const likedSet = new Set<string>();
          for (const medicine of medicinesData) {
            const liked = await isLiked(user.uid, medicine.id);
            if (liked) likedSet.add(medicine.id);
          }
          setLikedMedicines(likedSet);
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
        toast({
          title: "Error",
          description: "Failed to load medicines",
          variant: "destructive",
        });
      }
    };

    if (id) {
      fetchMedicines();
    }
  }, [id, toast, user]);

  const handleLike = async (medicineId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to add to favorites",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const isNowLiked = await toggleLike(user.uid, medicineId);
    setLikedMedicines(prev => {
      const newSet = new Set(prev);
      if (isNowLiked) {
        newSet.add(medicineId);
      } else {
        newSet.delete(medicineId);
      }
      return newSet;
    });

    toast({
      title: isNowLiked ? "Added to favorites" : "Removed from favorites",
      description: `Medicine has been ${isNowLiked ? "added to" : "removed from"} your favorites`,
    });
  };

  const handleAddToCart = async (medicine: Medicine) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to add to cart",
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
        title: "Authentication required",
        description: "Please login to purchase medicines",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate(`/medicine/${medicineId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Company Medicines</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {medicines.map((medicine) => (
          <Card key={medicine.id} className="flex flex-col">
            <CardContent className="p-3">
              <img
                src={medicine.image || "/placeholder.svg"}
                alt={medicine.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <h3 className="text-base font-semibold mb-1">{medicine.name}</h3>
              <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                {medicine.description}
              </p>
              <p className="text-primary font-bold text-sm">${medicine.price}</p>
              <p className="text-sm text-gray-500">Stock: {medicine.stock}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-2 mt-auto">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 ${likedMedicines.has(medicine.id) ? "text-red-500" : ""}`}
                onClick={() => handleLike(medicine.id)}
              >
                <Heart className={`h-4 w-4 ${likedMedicines.has(medicine.id) ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8"
                onClick={() => handleAddToCart(medicine)}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => handleBuy(medicine.id)}>
                <CreditCard className="h-4 w-4 mr-1" />
                Buy
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};