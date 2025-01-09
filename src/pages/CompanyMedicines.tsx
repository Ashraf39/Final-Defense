import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Medicine } from "@/types/medicine";
import { toggleLike, addToCart, isLiked } from "@/lib/medicines";
import { MedicineCard } from "@/components/home/MedicineCard";

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

  const handleBuy = (medicine: Medicine) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to purchase medicines",
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Company Medicines</h1>
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 p-8">
          {medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onLike={handleLike}
              onAddToCart={handleAddToCart}
              onBuy={handleBuy}
            />
          ))}
        </div>
      </div>
    </div>
  );
};