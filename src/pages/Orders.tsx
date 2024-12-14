import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  mobileMethod?: string;
  createdAt: Date;
  invoiceNumber: string;
  customerInfo: {
    displayName: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
}

export const Orders = () => {
  const { user, userRole } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const ordersRef = collection(db, "orders");
        let q;

        if (userRole === "company") {
          // For companies, fetch orders containing their medicines
          const companyMedicinesSnapshot = await getDocs(
            query(collection(db, "medicines"), where("companyId", "==", user.uid))
          );
          const companyMedicineIds = companyMedicinesSnapshot.docs.map(doc => doc.id);
          
          q = query(
            ordersRef,
            orderBy("createdAt", "desc")
          );

          const querySnapshot = await getDocs(q);
          const allOrders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          })) as Order[];

          // Filter orders that contain company's medicines
          const companyOrders = allOrders.filter(order =>
            order.items.some(item => companyMedicineIds.includes(item.medicineId))
          );

          setOrders(companyOrders);
        } else {
          // For regular users, fetch their orders
          q = query(
            ordersRef,
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
          );

          const querySnapshot = await getDocs(q);
          const userOrders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          })) as Order[];

          setOrders(userOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
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

      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found</p>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <p className="font-semibold">Invoice #{order.invoiceNumber}</p>
                  <p className="text-sm text-gray-500">
                    {format(order.createdAt, "PPpp")}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <Badge variant={order.status === "pending" ? "secondary" : "success"}>
                    {order.status}
                  </Badge>
                </div>
              </div>

              {userRole === "company" && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <p>Name: {order.customerInfo.displayName}</p>
                  <p>Email: {order.customerInfo.email}</p>
                  <p>Phone: {order.customerInfo.phoneNumber}</p>
                  <p>Address: {order.customerInfo.address}</p>
                </div>
              )}

              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-sm text-gray-600">
                      {order.paymentMethod}
                      {order.mobileMethod && ` (${order.mobileMethod})`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};