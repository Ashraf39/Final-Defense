import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ArrowLeft, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Medicine } from "@/types/medicine";
import { toggleLike, addToCart, isLiked } from "@/lib/medicines";

export const MedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [isLikedByUser, setIsLikedByUser] = useState(false);

  useEffect(() => {
    const fetchMedicine = async () => {
      if (!id) return;

      try {
        const medicineDoc = await getDoc(doc(db, "medicines", id));
        if (medicineDoc.exists()) {
          const medicineData = { id: medicineDoc.id, ...medicineDoc.data() } as Medicine;
          setMedicine(medicineData);

          if (user) {
            const liked = await isLiked(user.uid, id);
            setIsLikedByUser(liked);
          }
        } else {
          toast({
            title: "Error",
            description: "Medicine not found",
            variant: "destructive",
          });
          navigate(-1);
        }
      } catch (error) {
        console.error("Error fetching medicine:", error);
        toast({
          title: "Error",
          description: "Failed to load medicine details",
          variant: "destructive",
        });
      }
    };

    fetchMedicine();
  }, [id, user, toast, navigate]);

  const handleLike = async () => {
    if (!user || !medicine) {
      toast({
        title: "Authentication required",
        description: "Please login to add to favorites",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const isNowLiked = await toggleLike(user.uid, medicine.id);
    setIsLikedByUser(isNowLiked);
    toast({
      title: isNowLiked ? "Added to favorites" : "Removed from favorites",
      description: `Medicine has been ${isNowLiked ? "added to" : "removed from"} your favorites`,
    });
  };

  const handleAddToCart = async () => {
    if (!user || !medicine) {
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

  const handleBuy = () => {
    if (!user || !medicine) {
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

  if (!medicine) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden">
          <img
            src={medicine.image || "/placeholder.svg"}
            alt={medicine.name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{medicine.name}</h1>
            <p className="text-2xl font-bold text-primary">${medicine.price}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{medicine.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Stock</h2>
            <p className="text-gray-600">{medicine.stock} units available</p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className={isLikedByUser ? "text-red-500" : ""}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 mr-2 ${isLikedByUser ? "fill-current" : ""}`} />
              {isLikedByUser ? "Liked" : "Like"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              onClick={handleBuy}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};