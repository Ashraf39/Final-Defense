import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Medicine } from "@/types/medicine";

interface DeleteMedicineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicine: Medicine;
  onMedicineDeleted: (medicineId: string) => void;
}

export const DeleteMedicineDialog = ({
  open,
  onOpenChange,
  medicine,
  onMedicineDeleted,
}: DeleteMedicineDialogProps) => {
  const { toast } = useToast();

  const handleDeleteMedicine = async () => {
    try {
      const medicineRef = doc(db, "medicines", medicine.id);
      await deleteDoc(medicineRef);
      onMedicineDeleted(medicine.id);
    } catch (error) {
      console.error("Error deleting medicine:", error);
      toast({
        title: "Error",
        description: "Failed to delete medicine",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Medicine</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {medicine.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteMedicine}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};