import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Medicine } from "@/types/medicine";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditMedicineDialog } from "@/components/inventory/EditMedicineDialog";
import { AddMedicineDialog } from "@/components/inventory/AddMedicineDialog";
import { DeleteMedicineDialog } from "@/components/inventory/DeleteMedicineDialog";

export const Inventory = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!user || userRole !== "company") {
      navigate("/");
      return;
    }

    const fetchMedicines = async () => {
      try {
        const medicinesRef = collection(db, "medicines");
        const q = query(medicinesRef, where("companyId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const medicinesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Medicine[];
        setMedicines(medicinesData);
      } catch (error) {
        console.error("Error fetching medicines:", error);
        toast({
          title: "Error",
          description: "Failed to load medicines",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [user, userRole, navigate, toast]);

  const handleMedicineUpdated = (updatedMedicine: Medicine) => {
    setMedicines((prev) =>
      prev.map((medicine) =>
        medicine.id === updatedMedicine.id ? updatedMedicine : medicine
      )
    );
    setIsEditDialogOpen(false);
    toast({
      title: "Success",
      description: "Medicine updated successfully",
    });
  };

  const handleMedicineAdded = (newMedicine: Medicine) => {
    setMedicines((prev) => [...prev, newMedicine]);
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Medicine added successfully",
    });
  };

  const handleMedicineDeleted = (medicineId: string) => {
    setMedicines((prev) => prev.filter((medicine) => medicine.id !== medicineId));
    setIsDeleteDialogOpen(false);
    toast({
      title: "Success",
      description: "Medicine deleted successfully",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Medicine
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((medicine) => (
              <TableRow key={medicine.id}>
                <TableCell>{medicine.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {medicine.description}
                </TableCell>
                <TableCell>${medicine.price}</TableCell>
                <TableCell>{medicine.stock}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMedicine(medicine);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMedicine(medicine);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddMedicineDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onMedicineAdded={handleMedicineAdded}
        userId={user?.uid || ""}
      />

      {selectedMedicine && (
        <>
          <EditMedicineDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            medicine={selectedMedicine}
            onMedicineUpdated={handleMedicineUpdated}
          />
          <DeleteMedicineDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            medicine={selectedMedicine}
            onMedicineDeleted={handleMedicineDeleted}
          />
        </>
      )}
    </div>
  );
};