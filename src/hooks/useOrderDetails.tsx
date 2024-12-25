import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/types/order";

export const useOrderDetails = (invoiceNumber: string | undefined) => {
  return useQuery({
    queryKey: ['order', invoiceNumber],
    queryFn: async () => {
      if (!invoiceNumber) throw new Error('Invoice number is required');
      
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("invoiceNumber", "==", invoiceNumber));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Order not found');
      }
      
      const orderDoc = querySnapshot.docs[0];
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