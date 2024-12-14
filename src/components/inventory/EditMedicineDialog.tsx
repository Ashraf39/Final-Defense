import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Medicine } from "@/types/medicine";

interface EditMedicineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicine: Medicine;
  onMedicineUpdated: (medicine: Medicine) => void;
}

export const EditMedicineDialog = ({
  open,
  onOpenChange,
  medicine,
  onMedicineUpdated,
}: EditMedicineDialogProps) => {
  const { toast } = useToast();
  const [editedMedicine, setEditedMedicine] = useState(medicine);

  useEffect(() => {
    setEditedMedicine(medicine);
  }, [medicine]);

  const handleUpdateMedicine = async () => {
    try {
      const medicineRef = doc(db, "medicines", medicine.id);
      const updateData = {
        name: editedMedicine.name,
        description: editedMedicine.description,
        price: parseFloat(editedMedicine.price.toString()),
        stock: parseInt(editedMedicine.stock.toString()),
        image: editedMedicine.image,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(medicineRef, updateData);
      
      onMedicineUpdated({
        ...editedMedicine,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating medicine:", error);
      toast({
        title: "Error",
        description: "Failed to update medicine",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Medicine</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={editedMedicine.name}
              onChange={(e) =>
                setEditedMedicine({ ...editedMedicine, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={editedMedicine.description}
              onChange={(e) =>
                setEditedMedicine({ ...editedMedicine, description: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              step="0.01"
              value={editedMedicine.price}
              onChange={(e) =>
                setEditedMedicine({ ...editedMedicine, price: parseFloat(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Stock</label>
            <Input
              type="number"
              value={editedMedicine.stock}
              onChange={(e) =>
                setEditedMedicine({ ...editedMedicine, stock: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Image URL</label>
            <Input
              value={editedMedicine.image}
              onChange={(e) =>
                setEditedMedicine({ ...editedMedicine, image: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateMedicine}>Update Medicine</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};