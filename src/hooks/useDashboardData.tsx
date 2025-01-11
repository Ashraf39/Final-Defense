import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { DashboardData, Medicine, Order } from "@/types/dashboard";
import { useToast } from "@/hooks/use-toast";

export const useDashboardData = (userId: string) => {
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    monthlySales: 0,
    activeCustomers: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [popularProducts, setPopularProducts] = useState<Medicine[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch company's medicines
        const productsQuery = query(
          collection(db, "medicines"),
          where("companyId", "==", userId)
        );
        const productsSnapshot = await getDocs(productsQuery);
        const totalProducts = productsSnapshot.size;
        const companyMedicineIds = productsSnapshot.docs.map(doc => doc.id);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Medicine[];

        // Time calculations
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoTimestamp = Timestamp.fromDate(thirtyDaysAgo);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Fetch orders
        const ordersQuery = query(
          collection(db, "orders"),
          where("createdAt", ">=", thirtyDaysAgoTimestamp),
          orderBy("createdAt", "desc")
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
          );

        // Calculate monthly sales
        const monthlySales = recentOrdersData.reduce((total, order) => {
          const companyItems = order.items.filter(item => 
            companyMedicineIds.includes(item.medicineId)
          );
          const orderTotal = companyItems.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
          );
          return total + orderTotal;
        }, 0);

        // Calculate active customers
        const recentCustomers = recentOrdersData
          .filter(order => order.createdAt >= sevenDaysAgo)
          .map(order => order.userId);
        const activeCustomers = new Set(recentCustomers).size;

        // Calculate pending orders (all orders except delivered and cancelled)
        const pendingOrders = recentOrdersData.filter(
          order => order.status !== "delivered" && order.status !== "cancelled"
        ).length;

        // Calculate top sold medicines
        const medicinesSalesMap = new Map<string, number>();
        
        recentOrdersData.forEach(order => {
          order.items.forEach(item => {
            if (companyMedicineIds.includes(item.medicineId)) {
              const currentSales = medicinesSalesMap.get(item.medicineId) || 0;
              medicinesSalesMap.set(item.medicineId, currentSales + item.quantity);
            }
          });
        });

        const topSoldMedicines = productsData
          .map(medicine => ({
            ...medicine,
            sales: medicinesSalesMap.get(medicine.id) || 0
          }))
          .sort((a, b) => (b.sales || 0) - (a.sales || 0))
          .slice(0, 3);

        setRecentOrders(recentOrdersData.slice(0, 3));
        setDashboardData({
          totalProducts,
          monthlySales,
          activeCustomers,
          pendingOrders
        });
        setPopularProducts(topSoldMedicines);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        });
      }
    };

    if (userId) {
      fetchDashboardData();
    }
  }, [userId, toast]);

  return {
    dashboardData,
    recentOrders,
    popularProducts
  };
};