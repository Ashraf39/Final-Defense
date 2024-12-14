import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { OrderCard } from "@/components/orders/OrderCard";
import { Card } from "@/components/ui/card";
import { Order } from "@/types/order";

export const Orders = () => {
  const { user, userRole } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [companyMedicineIds, setCompanyMedicineIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        // If company, first fetch their medicine IDs
        if (userRole === "company") {
          const medicinesSnapshot = await getDocs(
            query(collection(db, "medicines"), where("companyId", "==", user.uid))
          );
          setCompanyMedicineIds(medicinesSnapshot.docs.map(doc => doc.id));
        }

        const ordersRef = collection(db, "orders");
        let q;

        if (userRole === "company") {
          q = query(ordersRef);
        } else {
          try {
            q = query(
              ordersRef,
              where("userId", "==", user.uid),
              orderBy("createdAt", "desc")
            );
          } catch (error: any) {
            if (error.code === 'failed-precondition') {
              setIndexError(error.message);
              q = query(ordersRef, where("userId", "==", user.uid));
            } else {
              throw error;
            }
          }
        }

        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        })) as Order[];

        // Sort orders by date if needed
        fetchedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, userRole]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Please login to view orders</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {userRole === "company" ? "Company Orders" : "My Orders"}
      </h1>

      {indexError && (
        <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
          <p className="text-yellow-800 mb-2">
            Note: The order list might need a moment to optimize.
          </p>
        </Card>
      )}

      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found</p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isCompany={userRole === "company"}
              companyMedicineIds={companyMedicineIds}
            />
          ))
        )}
      </div>
    </div>
  );
};
