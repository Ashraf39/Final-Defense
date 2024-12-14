import { useState } from "react";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { processOrder } from "@/lib/orders";

interface OrderItem {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
}

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchName: string;
  transactionId: string;
}

interface CustomerInfo {
  displayName: string;
  phoneNumber: string;
  address: string;
  email: string;
}

export const useOrderProcessing = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const processOrderSubmission = async (
    items: OrderItem[],
    total: number,
    paymentMethod: string,
    mobileMethod: string,
    bankDetails: BankDetails,
    customerInfo: CustomerInfo,
    isSingleItem: boolean
  ) => {
    try {
      setLoading(true);

      const orderData = {
        userId,
        items,
        total,
        paymentMethod,
        mobileMethod: mobileMethod || null,
        status: "pending",
        createdAt: new Date(),
        customerInfo,
        invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ...(paymentMethod === "bank" && { bankDetails }),
      };

      const orderRef = await addDoc(collection(db, "orders"), orderData);

      // Process the order immediately to update stock
      await processOrder(orderRef.id);

      if (!isSingleItem) {
        const cartRef = collection(db, "cartItems");
        const q = query(cartRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.forEach(async (document) => {
          await deleteDoc(doc(db, "cartItems", document.id));
        });
      }

      toast({
        title: "Order placed successfully",
        description: "You will be redirected to your orders",
      });

      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    processOrderSubmission,
  };
};