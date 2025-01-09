import { useNavigate } from "react-router-dom";
import { Medicine } from "@/types/medicine";
import { useToast } from "@/components/ui/use-toast";
import { ProductTile } from "@/components/products/ProductTile";
import { useState } from "react";
import { MedicineDetailsDialog } from "../dashboard/MedicineDetailsDialog";

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
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

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
    <>
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Your Favorites</h2>
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-4">
            {likedMedicines.map((medicine) => (
              <ProductTile
                key={medicine.id}
                medicine={medicine}
                onClick={() => setSelectedMedicine(medicine)}
              />
            ))}
          </div>
        </div>
      </section>

      <MedicineDetailsDialog
        medicine={selectedMedicine}
        isOpen={!!selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
      />
    </>
  );
};