import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Medicine } from "@/types/medicine";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AddMedicineDialog } from "@/components/inventory/AddMedicineDialog";
import { EditMedicineDialog } from "@/components/inventory/EditMedicineDialog";
import { DeleteMedicineDialog } from "@/components/inventory/DeleteMedicineDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Inventory = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

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

  const handleEdit = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowEditDialog(true);
  };

  const handleDelete = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowDeleteDialog(true);
  };

  const handleMedicineAdded = (newMedicine: Medicine) => {
    setMedicines((prev) => [...prev, newMedicine]);
    setShowAddDialog(false);
    toast({
      title: "Success",
      description: "Medicine added successfully",
    });
  };

  const handleMedicineUpdated = (updatedMedicine: Medicine) => {
    setMedicines((prev) =>
      prev.map((medicine) =>
        medicine.id === updatedMedicine.id ? updatedMedicine : medicine
      )
    );
    setShowEditDialog(false);
    toast({
      title: "Success",
      description: "Medicine updated successfully",
    });
  };

  const handleMedicineDeleted = (medicineId: string) => {
    setMedicines((prev) => prev.filter((medicine) => medicine.id !== medicineId));
    setShowDeleteDialog(false);
    toast({
      title: "Success",
      description: "Medicine deleted successfully",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button onClick={() => setShowAddDialog(true)}>
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
                      onClick={() => handleEdit(medicine)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(medicine)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showAddDialog && (
        <AddMedicineDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onMedicineAdded={handleMedicineAdded}
          userId={user?.uid || ""}
        />
      )}

      {showEditDialog && selectedMedicine && (
        <EditMedicineDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          medicine={selectedMedicine}
          onMedicineUpdated={handleMedicineUpdated}
        />
      )}

      {showDeleteDialog && selectedMedicine && (
        <DeleteMedicineDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          medicine={selectedMedicine}
          onMedicineDeleted={handleMedicineDeleted}
        />
      )}
    </div>
  );
};