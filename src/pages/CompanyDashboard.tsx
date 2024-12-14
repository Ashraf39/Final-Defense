import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AddMedicineForm } from "@/components/dashboard/AddMedicineForm";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { PopularProducts } from "@/components/dashboard/PopularProducts";
import { DashboardData, Medicine, Order } from "@/types/dashboard";
import { useToast } from "@/components/ui/use-toast";

export const CompanyDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    monthlySales: 0,
    activeCustomers: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [popularProducts, setPopularProducts] = useState<Medicine[]>([]);

  useEffect(() => {
    if (!user || userRole !== "company") {
      navigate("/");
    }
  }, [user, userRole, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        console.log("Fetching dashboard data for company:", user.uid);
        
        // Fetch total products for the specific company
        const productsQuery = query(
          collection(db, "medicines"),
          where("companyId", "==", user.uid)
        );
        const productsSnapshot = await getDocs(productsQuery);
        const totalProducts = productsSnapshot.size;
        console.log("Total products found:", totalProducts);

        // Get all medicine IDs for this company
        const companyMedicineIds = productsSnapshot.docs.map(doc => doc.id);
        console.log("Company medicine IDs:", companyMedicineIds);

        // Fetch 3 most recent orders that contain any of the company's medicines
        const ordersQuery = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc"),
          limit(10) // Fetch more than needed as we'll filter
        );
        
        const ordersSnapshot = await getDocs(ordersQuery);
        const recentOrdersData = ordersSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate()
          } as Order))
          .filter(order => 
            order.items.some(item => 
              companyMedicineIds.includes(item.medicineId)
            )
          )
          .slice(0, 3);

        console.log("Recent orders found:", recentOrdersData.length);
        setRecentOrders(recentOrdersData);

        // Update dashboard data with the correct total products count
        setDashboardData(prev => ({
          ...prev,
          totalProducts
        }));

        // Store products data for popular products section
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Medicine[];
        
        // Sort by sales (if available) and take top 5
        const sortedProducts = productsData
          .sort((a, b) => (b.sales || 0) - (a.sales || 0))
          .slice(0, 5);
        setPopularProducts(sortedProducts);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        });
      }
    };

    fetchDashboardData();
  }, [user, toast]);

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
            description: "Revenue this month",
            icon: "TrendingUp"
          },
          {
            title: "Active Customers",
            value: dashboardData.activeCustomers.toString(),
            description: "Customers this month",
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
        <RecentOrders orders={recentOrders} />
        <PopularProducts products={popularProducts} />
      </div>
    </div>
  );
};