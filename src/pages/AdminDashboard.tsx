import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Package } from "lucide-react";
import { UserManagement } from "@/components/admin/UserManagement";

export const AdminDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [showUserManagement, setShowUserManagement] = useState(false);

  useEffect(() => {
    if (!user || userRole !== "admin") {
      navigate("/");
    }
  }, [user, userRole, navigate]);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const usersQuery = query(collection(db, "users"));
      const medicinesQuery = query(collection(db, "medicines"));
      const ordersQuery = query(collection(db, "orders"));

      const [usersSnapshot, medicinesSnapshot, ordersSnapshot] = await Promise.all([
        getDocs(usersQuery),
        getDocs(medicinesQuery),
        getDocs(ordersQuery)
      ]);

      return {
        totalUsers: usersSnapshot.size,
        totalCompanies: usersSnapshot.docs.filter(doc => doc.data().role === "company").length,
        totalMedicines: medicinesSnapshot.size,
        totalOrders: ordersSnapshot.size,
      };
    },
  });

  if (!user || userRole !== "admin") return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage users and monitor system activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <CardDescription>Registered users in the system</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCompanies || 0}</div>
            <CardDescription>Registered pharmaceutical companies</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMedicines || 0}</div>
            <CardDescription>Available medicines in catalog</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage system users and their roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setShowUserManagement(true)}
            >
              <User className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medicine Management</CardTitle>
            <CardDescription>Monitor and manage medicine catalog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/admin/medicines")}
            >
              <Package className="mr-2 h-4 w-4" />
              View All Medicines
            </Button>
          </CardContent>
        </Card>
      </div>

      {showUserManagement && (
        <UserManagement onClose={() => setShowUserManagement(false)} />
      )}
    </div>
  );
};
