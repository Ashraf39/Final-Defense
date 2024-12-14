import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Medicine } from "@/types/medicine";

interface AddMedicineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMedicineAdded: (medicine: Medicine) => void;
  userId: string;
}

export const AddMedicineDialog = ({
  open,
  onOpenChange,
  onMedicineAdded,
  userId,
}: AddMedicineDialogProps) => {
  const { toast } = useToast();
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  const handleAddMedicine = async () => {
    try {
      const medicineData = {
        name: newMedicine.name,
        description: newMedicine.description,
        price: parseFloat(newMedicine.price),
        stock: parseInt(newMedicine.stock),
        image: newMedicine.image || "/placeholder.svg",
        companyId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "medicines"), medicineData);
      
      onMedicineAdded({
        id: docRef.id,
        ...medicineData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setNewMedicine({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
      });
    } catch (error) {
      console.error("Error adding medicine:", error);
      toast({
        title: "Error",
        description: "Failed to add medicine",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={newMedicine.name}
              onChange={(e) =>
                setNewMedicine({ ...newMedicine, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={newMedicine.description}
              onChange={(e) =>
                setNewMedicine({ ...newMedicine, description: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              step="0.01"
              value={newMedicine.price}
              onChange={(e) =>
                setNewMedicine({ ...newMedicine, price: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Stock</label>
            <Input
              type="number"
              value={newMedicine.stock}
              onChange={(e) =>
                setNewMedicine({ ...newMedicine, stock: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Image URL</label>
            <Input
              value={newMedicine.image}
              onChange={(e) =>
                setNewMedicine({ ...newMedicine, image: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddMedicine}>Add Medicine</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};