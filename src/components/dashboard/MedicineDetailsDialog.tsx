import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Medicine } from "@/types/medicine";
import { EditMedicineDialog } from "@/components/inventory/EditMedicineDialog";
import { DeleteMedicineDialog } from "@/components/inventory/DeleteMedicineDialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isLiked, toggleLike, addToCart } from "@/lib/medicines";
import { MedicineActionButtons } from "./MedicineActionButtons";
import { MedicineAdminActions } from "./MedicineAdminActions";

interface MedicineDetailsDialogProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicineDetailsDialog = ({ medicine, isOpen, onClose }: MedicineDetailsDialogProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  useEffect(() => {
    const checkIfLiked = async () => {
      if (user && medicine) {
        const liked = await isLiked(user.uid, medicine.id);
        setIsLikedByUser(liked);
      }
    };
    
    checkIfLiked();
  }, [user, medicine]);

  const handleMedicineUpdated = (updatedMedicine: Medicine) => {
    setIsEditDialogOpen(false);
    toast({
      title: "Success",
      description: "Medicine updated successfully",
    });
    onClose();
  };

  const handleMedicineDeleted = () => {
    toast({
      title: "Success",
      description: "Medicine deleted successfully",
    });
    onClose();
    navigate("/dashboard");
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to add to favorites",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!medicine) return;

    const isNowLiked = await toggleLike(user.uid, medicine.id);
    setIsLikedByUser(isNowLiked);
    toast({
      title: isNowLiked ? "Added to favorites" : "Removed from favorites",
      description: `Medicine has been ${isNowLiked ? "added to" : "removed from"} your favorites`,
    });
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to add to cart",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!medicine) return;

    await addToCart(user.uid, medicine);
    toast({
      title: "Added to cart",
      description: "Medicine has been added to your cart",
    });
  };

  const handleBuy = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to purchase medicines",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!medicine) return;

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

  if (!medicine) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Medicine Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="rounded-lg overflow-hidden">
              <img
                src={medicine.image || "/placeholder.svg"}
                alt={medicine.name}
                className="w-full h-[300px] object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{medicine.name}</h2>
                <p className="text-xl font-bold text-primary">BDT {medicine.price} per box</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{medicine.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Stock</h3>
                <p className="text-gray-600">{medicine.stock} box{medicine.stock === 1 ? '' : 'es'} available</p>
              </div>
              {userRole === "regular" || !userRole ? (
                <MedicineActionButtons
                  medicine={medicine}
                  isLikedByUser={isLikedByUser}
                  onLike={handleLike}
                  onAddToCart={handleAddToCart}
                  onBuy={handleBuy}
                />
              ) : (userRole === "company" || userRole === "admin") && (
                <MedicineAdminActions
                  onEdit={() => setIsEditDialogOpen(true)}
                  onDelete={() => setIsDeleteDialogOpen(true)}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {medicine && (
        <>
          <EditMedicineDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            medicine={medicine}
            onMedicineUpdated={handleMedicineUpdated}
          />
          <DeleteMedicineDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            medicine={medicine}
            onMedicineDeleted={handleMedicineDeleted}
          />
        </>
      )}
    </>
  );
};