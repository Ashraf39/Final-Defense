import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { CustomerInfoForm } from "@/components/checkout/CustomerInfoForm";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutProvider, useCheckout } from "@/contexts/CheckoutContext";
import { useOrderProcessing } from "@/hooks/useOrderProcessing";

const CheckoutContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const {
    items,
    total,
    paymentMethod,
    mobileMethod,
    bankDetails,
    customerInfo,
    setItems,
    setTotal,
    updateItemQuantity,
    setCustomerInfo,
    setPaymentMethod,
    setMobileMethod,
    setBankDetails,
  } = useCheckout();
  
  const { loading, processOrderSubmission } = useOrderProcessing(user?.uid || "");
  const [mobileDetails, setMobileDetails] = useState({ phoneNumber: "", transactionId: "" });

  useEffect(() => {
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
      }
    };

    fetchItems();
  }, [user, location.state]);

  const handleSubmit = async () => {
    if (!user) return;

    // Validate mobile payment details if mobile payment is selected
    if (paymentMethod === "mobile" && (!mobileDetails.phoneNumber || !mobileDetails.transactionId)) {
      toast({
        title: "Error",
        description: "Please fill in all mobile banking details",
        variant: "destructive",
      });
      return;
    }
    
    await processOrderSubmission(
      items,
      total,
      paymentMethod,
      mobileMethod,
      bankDetails,
      customerInfo,
      !!location.state?.singleItem,
      mobileDetails
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <CustomerInfoForm 
            userFormData={customerInfo}
            onFormDataChange={setCustomerInfo}
          />

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            mobileMethod={mobileMethod}
            onPaymentMethodChange={setPaymentMethod}
            onMobileMethodChange={setMobileMethod}
            onBankDetailsChange={setBankDetails}
            onMobileDetailsChange={setMobileDetails}
          />
        </div>

        <div>
          <OrderSummary
            items={items}
            total={total}
            loading={loading}
            onSubmit={handleSubmit}
            disabled={
              !paymentMethod || 
              (paymentMethod === "mobile" && (!mobileMethod || !mobileDetails.phoneNumber || !mobileDetails.transactionId)) ||
              (paymentMethod === "bank" && (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.transactionId))
            }
            onQuantityChange={updateItemQuantity}
          />
        </div>
      </div>
    </div>
  );
};

export const Checkout = () => {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
};