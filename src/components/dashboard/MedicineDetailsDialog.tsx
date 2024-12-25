import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Medicine } from "@/types/medicine";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { EditMedicineDialog } from "@/components/inventory/EditMedicineDialog";
import { DeleteMedicineDialog } from "@/components/inventory/DeleteMedicineDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface MedicineDetailsDialogProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicineDetailsDialog = ({ medicine, isOpen, onClose }: MedicineDetailsDialogProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
                <p className="text-xl font-bold text-primary">BDT {medicine.price}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{medicine.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Stock</h3>
                <p className="text-gray-600">{medicine.stock} units available</p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
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