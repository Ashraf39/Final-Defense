import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { processMobilePayment } from "@/lib/payment";
import { CustomerInfoForm } from "@/components/checkout/CustomerInfoForm";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { OrderSummary } from "@/components/checkout/OrderSummary";

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

      if (paymentMethod === "mobile" && mobileMethod) {
        setMobilePaymentStatus("processing");
        try {
          const paymentResult = await processMobilePayment({
            phoneNumber: userFormData.phoneNumber,
            amount: total,
            method: mobileMethod as 'bkash' | 'nagad' | 'rocket',
          });
          setMobilePaymentStatus("completed");
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
          <CustomerInfoForm 
            userFormData={userFormData}
            onFormDataChange={(data) => setUserFormData(prev => ({ ...prev, ...data }))}
          />

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            mobileMethod={mobileMethod}
            onPaymentMethodChange={setPaymentMethod}
            onMobileMethodChange={setMobileMethod}
            onBankDetailsChange={setBankDetails}
          />
        </div>

        <div>
          <OrderSummary
            items={items}
            total={total}
            loading={loading}
            onSubmit={handleSubmitOrder}
            disabled={!paymentMethod || (paymentMethod === "mobile" && !mobileMethod)}
          />
        </div>
      </div>
    </div>
  );
};