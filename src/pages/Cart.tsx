import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Trash2, MinusCircle, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  medicineId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    if (!user) return;
    
    try {
      const q = query(collection(db, "cartItems"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const items: CartItem[] = [];
      
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as CartItem);
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
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="mt-6 p-4 border rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                Continue Shopping
              </Button>
              <Button onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};