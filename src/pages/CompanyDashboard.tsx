import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AddMedicineForm } from "@/components/dashboard/AddMedicineForm";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { PopularProducts } from "@/components/dashboard/PopularProducts";
import { DashboardData, Medicine, Order } from "@/types/dashboard";

export const CompanyDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    monthlySales: 0,
    activeCustomers: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [popularProducts, setPopularProducts] = useState<Medicine[]>([]);

  // Protect the route - only allow company users
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
        
        // Fetch total products
        const productsQuery = query(
          collection(db, "medicines"),
          where("companyId", "==", user.uid)
        );
        const productsSnapshot = await getDocs(productsQuery);
        const totalProducts = productsSnapshot.size;

        // Fetch orders from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const ordersQuery = query(
          collection(db, "orders"),
          where("companyId", "==", user.uid),
          where("createdAt", ">=", thirtyDaysAgo)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        
        let monthlySales = 0;
        const uniqueCustomers = new Set();
        let pendingOrders = 0;
        
        ordersSnapshot.forEach((doc) => {
          const orderData = doc.data();
          monthlySales += orderData.total || 0;
          uniqueCustomers.add(orderData.userId);
          if (orderData.status === "pending") {
            pendingOrders++;
          }
        });

        setDashboardData({
          totalProducts,
          monthlySales,
          activeCustomers: uniqueCustomers.size,
          pendingOrders
        });

        // Fetch recent orders
        const recentOrdersQuery = query(
          collection(db, "orders"),
          where("companyId", "==", user.uid),
          where("status", "==", "pending")
        );
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
        const recentOrdersData = recentOrdersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setRecentOrders(recentOrdersData);

        // Fetch popular products
        const popularProductsData = productsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() })) as Medicine[];
        const sortedProducts = popularProductsData
          .sort((a, b) => (b.sales || 0) - (a.sales || 0))
          .slice(0, 5);
        setPopularProducts(sortedProducts);

        console.log("Dashboard data fetched successfully");
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [user]);

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