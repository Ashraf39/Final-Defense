import { useNavigate } from "react-router-dom";
import { Medicine } from "@/types/medicine";
import { useToast } from "@/components/ui/use-toast";
import { MedicineCard } from "./MedicineCard";

interface FavoritesSectionProps {
  likedMedicines: Medicine[];
  onLike: (medicineId: string) => Promise<void>;
  onAddToCart: (medicine: Medicine) => Promise<void>;
  isAuthenticated: boolean;
}

export const FavoritesSection = ({ 
  likedMedicines, 
  onLike, 
  onAddToCart, 
  isAuthenticated 
}: FavoritesSectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBuy = (medicine: Medicine) => {
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to be logged in to purchase medicines",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    navigate("/checkout", {
      state: {
        singleItem: {
          medicineId: medicine.id,
          name: medicine.name,
          quantity: 1,
          price: medicine.price
        }
      }
    });
  };

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Favorites</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {likedMedicines.map((medicine) => (
          <MedicineCard
            key={medicine.id}
            medicine={medicine}
            onLike={onLike}
            onAddToCart={onAddToCart}
            onBuy={handleBuy}
          />
        ))}
      </div>
    </section>
  );
};