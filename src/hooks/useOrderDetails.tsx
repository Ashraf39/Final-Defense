import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/types/order";

export const useOrderDetails = (orderId: string | undefined) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');
      const orderDoc = await getDoc(doc(db, "orders", orderId));
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
};