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

export const CompanyMedicines = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>([]);

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
  }, [id, toast]);

  const requireAuth = (action: () => void) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to perform this action",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    action();
  };

  const handleLike = (medicineId: string) => {
    requireAuth(() => {
      toast({
        title: "Added to favorites",
        description: "Medicine has been added to your favorites",
      });
    });
  };

  const handleAddToCart = (medicineId: string) => {
    requireAuth(() => {
      toast({
        title: "Added to cart",
        description: "Medicine has been added to your cart",
      });
    });
  };

  const handleBuy = (medicineId: string) => {
    requireAuth(() => {
      toast({
        title: "Proceeding to checkout",
        description: "Redirecting to payment page",
      });
    });
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
                className="h-8 w-8"
                onClick={() => handleLike(medicine.id)}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8"
                onClick={() => handleAddToCart(medicine.id)}
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