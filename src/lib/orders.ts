import { db } from "./firebase";
import { doc, updateDoc, getDoc, runTransaction } from "firebase/firestore";

export const updateOrderStatus = async (orderId: string, status: string) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { status });
};

export const processOrder = async (orderId: string) => {
  try {
    await runTransaction(db, async (transaction) => {
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await transaction.get(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error("Order not found");
      }

      const orderData = orderDoc.data();
      
      // Update stock for each medicine in the order
      for (const item of orderData.items) {
        const medicineRef = doc(db, "medicines", item.medicineId);
        const medicineDoc = await transaction.get(medicineRef);
        
        if (!medicineDoc.exists()) {
          throw new Error(`Medicine ${item.medicineId} not found`);
        }

        const currentStock = medicineDoc.data().stock;
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for medicine ${item.name}`);
        }

        transaction.update(medicineRef, {
          stock: currentStock - item.quantity
        });
      }

      // Update order status to processing
      transaction.update(orderRef, { status: "processing" });
    });

    return true;
  } catch (error) {
    console.error("Error processing order:", error);
    throw error;
  }
};