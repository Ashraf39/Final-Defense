import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AddMedicineFormProps {
  userId: string;
  onCancel: () => void;
}

export const AddMedicineForm = ({ userId, onCancel }: AddMedicineFormProps) => {
  const { toast } = useToast();
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();

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

      await addDoc(collection(db, "medicines"), medicineData);
      
      toast({
        title: "Success",
        description: "Medicine added successfully",
      });

      setNewMedicine({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
      });
      onCancel();
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
    <Card>
      <CardHeader>
        <CardTitle>Add New Medicine</CardTitle>
        <CardDescription>Enter medicine details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddMedicine} className="space-y-4">
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
          <div className="flex gap-2">
            <Button type="submit">Add Medicine</Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};