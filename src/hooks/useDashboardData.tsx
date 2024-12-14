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
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [totalPendingOrders, setTotalPendingOrders] = useState(0);
  const [popularProducts, setPopularProducts] = useState<Medicine[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const productsQuery = query(
          collection(db, "medicines"),
          where("companyId", "==", userId)
        );
        const productsSnapshot = await getDocs(productsQuery);
        const totalProducts = productsSnapshot.size;
        
        const companyMedicineIds = productsSnapshot.docs.map(doc => doc.id);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoTimestamp = Timestamp.fromDate(thirtyDaysAgo);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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

        const monthlySales = recentOrdersData.reduce((total, order) => {
          const companyItems = order.items.filter(item => 
            companyMedicineIds.includes(item.medicineId)
          );
          const orderTotal = companyItems.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
          );
          return total + orderTotal;
        }, 0);

        const allPendingOrders = recentOrdersData.filter(order => order.status === "pending");
        const pendingOrdersData = allPendingOrders.slice(0, 3);
        setPendingOrders(pendingOrdersData);
        setTotalPendingOrders(allPendingOrders.length);

        const recentCustomers = recentOrdersData
          .filter(order => order.createdAt >= sevenDaysAgo)
          .map(order => order.userId);
        const activeCustomers = new Set(recentCustomers).size;

        const latestOrders = recentOrdersData.slice(0, 3);
        setRecentOrders(latestOrders);

        setDashboardData({
          totalProducts,
          monthlySales,
          activeCustomers,
          pendingOrders: allPendingOrders.length
        });

        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Medicine[];
        
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

    if (userId) {
      fetchDashboardData();
    }
  }, [userId, toast]);

  return {
    dashboardData,
    recentOrders,
    pendingOrders,
    totalPendingOrders,
    popularProducts
  };
};