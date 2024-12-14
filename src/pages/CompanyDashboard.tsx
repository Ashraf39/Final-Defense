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
import { Plus } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AddMedicineForm } from "@/components/dashboard/AddMedicineForm";

export const CompanyDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);

  // Protect the route - only allow company users
  useEffect(() => {
    if (!user || userRole !== "company") {
      navigate("/");
    }
  }, [user, userRole, navigate]);

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

      {isAddingMedicine && user && (
        <div className="mb-8">
          <AddMedicineForm
            userId={user.uid}
            onCancel={() => setIsAddingMedicine(false)}
          />
        </div>
      )}

      <DashboardStats />

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