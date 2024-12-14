import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AddMedicineForm } from "@/components/dashboard/AddMedicineForm";
import { PopularProducts } from "@/components/dashboard/PopularProducts";
import { RecentOrdersSection } from "@/components/dashboard/RecentOrdersSection";
import { PendingOrdersSection } from "@/components/dashboard/PendingOrdersSection";
import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";

export const CompanyDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  
  const {
    dashboardData,
    recentOrders,
    pendingOrders,
    totalPendingOrders,
    popularProducts
  } = useDashboardData(user?.uid || "");

  if (!user || userRole !== "company") {
    navigate("/");
    return null;
  }

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

      <DashboardStats
        stats={[
          {
            title: "Total Products",
            value: dashboardData.totalProducts.toString(),
            description: "Active medicines in catalog",
            icon: "Package"
          },
          {
            title: "Monthly Sales",
            value: `$${dashboardData.monthlySales.toFixed(2)}`,
            description: "Revenue in last 30 days",
            icon: "TrendingUp"
          },
          {
            title: "Active Customers",
            value: dashboardData.activeCustomers.toString(),
            description: "Customers in last 7 days",
            icon: "Users"
          },
          {
            title: "Pending Orders",
            value: dashboardData.pendingOrders.toString(),
            description: "Orders to be processed",
            icon: "ClipboardList"
          }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentOrdersSection orders={recentOrders} />
        <PendingOrdersSection 
          orders={pendingOrders}
          totalPendingOrders={totalPendingOrders}
        />
      </div>

      <div className="mt-6">
        <PopularProducts products={popularProducts} />
      </div>
    </div>
  );
};