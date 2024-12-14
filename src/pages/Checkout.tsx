import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BankPaymentDetails } from "@/components/payment/BankPaymentDetails";
import { processMobilePayment } from "@/lib/payment";

interface OrderItem {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
}

interface UserData {
  displayName: string;
  phoneNumber: string;
  address: string;
  email: string;
}

export const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [mobileMethod, setMobileMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userFormData, setUserFormData] = useState({
    displayName: "",
    phoneNumber: "",
    address: "",
    email: "",
  });
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    branchName: "",
    transactionId: "",
  });
  const [mobilePaymentStatus, setMobilePaymentStatus] = useState<"idle" | "processing" | "completed">("idle");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
        setUserFormData({
          displayName: data.displayName || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          email: data.email || "",
        });
      }
    };

    const fetchItems = async () => {
      if (!user) return;
      try {
        if (location.state?.singleItem) {
          setItems([location.state.singleItem]);
          setTotal(location.state.singleItem.price * location.state.singleItem.quantity);
        } else {
          const cartRef = collection(db, "cartItems");
          const q = query(cartRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const cartItems = querySnapshot.docs.map(doc => ({
            medicineId: doc.data().medicineId,
            name: doc.data().name,
            quantity: doc.data().quantity,
            price: doc.data().price
          }));
          setItems(cartItems);
          setTotal(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        toast({
          title: "Error",
          description: "Failed to load items",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
    fetchItems();
  }, [user, location.state]);

  const generateInvoiceNumber = () => {
    return `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleSubmitOrder = async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      // Process mobile payment if selected
      if (paymentMethod === "mobile" && mobileMethod) {
        setMobilePaymentStatus("processing");
        try {
          const paymentResult = await processMobilePayment({
            phoneNumber: userFormData.phoneNumber,
            amount: total,
            method: mobileMethod as 'bkash' | 'nagad' | 'rocket',
          });
          setMobilePaymentStatus("completed");
          // Store the transaction ID
          bankDetails.transactionId = paymentResult.transactionId;
        } catch (error) {
          toast({
            title: "Payment Failed",
            description: "Mobile payment processing failed. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }
      
      const invoiceNumber = generateInvoiceNumber();
      const orderData = {
        userId: user.uid,
        items: items,
        total: total,
        paymentMethod: paymentMethod,
        mobileMethod: mobileMethod,
        status: "pending",
        createdAt: new Date(),
        invoiceNumber,
        customerInfo: userFormData,
        ...(paymentMethod === "bank" && { bankDetails }),
      };

      await addDoc(collection(db, "orders"), orderData);

      // Clear cart if coming from cart page
      if (!location.state?.singleItem) {
        const cartRef = collection(db, "cartItems");
        const q = query(cartRef, where("userId", "==", user.uid));
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
      setMobilePaymentStatus("idle");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to checkout</h1>
        <Button onClick={() => navigate("/login")}>Login</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Full Name</Label>
                <Input
                  id="displayName"
                  value={userFormData.displayName}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={userFormData.phoneNumber}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  value={userFormData.address}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Cash on Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank">Bank Transfer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobile" id="mobile" />
                <Label htmlFor="mobile">Mobile Banking</Label>
              </div>
            </RadioGroup>

            {paymentMethod === "bank" && (
              <BankPaymentDetails onDetailsChange={setBankDetails} />
            )}

            {paymentMethod === "mobile" && (
              <div className="mt-4">
                <h3 className="font-medium mb-3">Select Mobile Banking Method</h3>
                <RadioGroup value={mobileMethod} onValueChange={setMobileMethod} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bkash" id="bkash" />
                    <Label htmlFor="bkash">Bkash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nagad" id="nagad" />
                    <Label htmlFor="nagad">Nagad</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rocket" id="rocket" />
                    <Label htmlFor="rocket">Rocket</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Total:</p>
                  <p className="font-semibold">${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </Card>

          <Button
            className="w-full mt-6"
            onClick={handleSubmitOrder}
            disabled={!paymentMethod || (paymentMethod === "mobile" && !mobileMethod) || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
