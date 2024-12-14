import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  TrendingUp,
  Users,
  ClipboardList,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const CompanyDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  // Protect the route - only allow company users
  useEffect(() => {
    if (!user || userRole !== "company") {
      navigate("/");
    }
  }, [user, userRole, navigate]);

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const medicineData = {
        name: newMedicine.name,
        description: newMedicine.description,
        price: parseFloat(newMedicine.price),
        stock: parseInt(newMedicine.stock),
        image: newMedicine.image || "/placeholder.svg",
        companyId: user.uid,
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
      setIsAddingMedicine(false);
    } catch (error) {
      console.error("Error adding medicine:", error);
      toast({
        title: "Error",
        description: "Failed to add medicine",
        variant: "destructive",
      });
    }
  };

  const stats = [
    {
      title: "Total Products",
      value: "24",
      description: "Active medicines in catalog",
      icon: Package,
    },
    {
      title: "Monthly Sales",
      value: "$12,345",
      description: "Revenue this month",
      icon: TrendingUp,
    },
    {
      title: "Active Customers",
      value: "1,234",
      description: "Customers this month",
      icon: Users,
    },
    {
      title: "Pending Orders",
      value: "12",
      description: "Orders to be processed",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your products and orders
          </p>
        </div>
        <Button onClick={() => setIsAddingMedicine(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Medicine
        </Button>
      </div>

      {isAddingMedicine && (
        <Card className="mb-8">
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
                  onClick={() => setIsAddingMedicine(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Products</CardTitle>
            <CardDescription>Most sold medicines</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No products data available</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};