import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";

interface CartItemType {
  id: string;
  medicineId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCartItems = async () => {
    if (!user) return;
    
    try {
      const q = query(collection(db, "cartItems"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const items: CartItemType[] = [];
      
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as CartItemType);
      });
      
      setCartItems(items);
    } catch (error) {
      toast({
        title: "Error fetching cart items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const docRef = doc(db, "cartItems", itemId);
      await updateDoc(docRef, { quantity: newQuantity });
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      toast({
        title: "Error updating quantity",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, "cartItems", itemId));
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Item removed from cart",
      });
    } catch (error) {
      toast({
        title: "Error removing item",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view your cart</h1>
        <Button onClick={() => navigate("/login")}>Login</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              {...item}
              onQuantityChange={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
          
          <CartSummary 
            items={cartItems}
            total={calculateTotal()}
          />
        </div>
      )}
    </div>
  );
};