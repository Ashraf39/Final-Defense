import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Medicine } from "@/types/medicine";
import { useToast } from "@/components/ui/use-toast";

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
    
    // Navigate to checkout with the single item
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
                    onClick={() => onLike(medicine.id)}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onAddToCart(medicine)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleBuy(medicine)}
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
  );
};