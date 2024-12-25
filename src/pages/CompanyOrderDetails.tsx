import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { OrderCard } from "@/components/orders/OrderCard";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Order } from "@/types/order";

export const CompanyOrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) throw new Error('Order ID is required');
      const orderDoc = await getDoc(doc(db, "orders", id));
      if (!orderDoc.exists()) throw new Error('Order not found');
      
      const data = orderDoc.data();
      const order: Order = {
        id: orderDoc.id,
        userId: data.userId,
        items: data.items,
        total: data.total,
        status: data.status,
        createdAt: data.createdAt.toDate(),
        paymentMethod: data.paymentMethod,
        mobileMethod: data.mobileMethod,
        bankDetails: data.bankDetails,
        customerInfo: data.customerInfo,
        invoiceNumber: data.invoiceNumber
      };
      
      return order;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>
      <OrderCard 
        order={order} 
        isCompany={true}
      />
    </div>
  );
};