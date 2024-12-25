import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useCartClear = (userId: string | undefined) => {
  const clearCart = async () => {
    if (!userId) return;
    
    try {
      const cartRef = collection(db, "cartItems");
      const q = query(cartRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(document => 
        deleteDoc(doc(db, "cartItems", document.id))
      );
      
      await Promise.all(deletePromises);
      console.log("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  return { clearCart };
};