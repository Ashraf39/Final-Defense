import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomerInfoForm } from "./CustomerInfoForm";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { OrderSummary } from "./OrderSummary";
import { CheckoutProvider, useCheckout } from "@/contexts/CheckoutContext";
import { useOrderProcessing } from "@/hooks/useOrderProcessing";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    items,
    setItems,
    paymentMethod,
    mobileMethod,
    bankDetails,
    customerInfo,
    setCustomerInfo,
    setPaymentMethod,
    setMobileMethod,
    setBankDetails,
  } = useCheckout();

  const [total, setTotal] = useState(0);
  const { loading, processOrderSubmission } = useOrderProcessing(user?.uid || '');

  useEffect(() => {
    const state = location.state;
    if (state?.total) {
      console.log('Setting total from state:', state.total);
      setTotal(state.total);
    }
    if (state?.singleItem) {
      console.log('Processing single item purchase:', state.singleItem);
      const initialItems = [{
        medicineId: state.singleItem.medicineId,
        name: state.singleItem.name,
        quantity: Number(state.singleItem.quantity) || 1,
        price: Number(state.singleItem.price)
      }];
      console.log('Processed single item:', initialItems);
      setItems(initialItems);
      setTotal(initialItems[0].price * initialItems[0].quantity);
    } else if (state?.items && Array.isArray(state.items)) {
      console.log('Processing cart items:', state.items);
      const cartItems = state.items.map((item: any) => ({
        medicineId: item.medicineId,
        name: item.name,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price)
      }));
      console.log('Processed cart items:', cartItems);
      setItems(cartItems);
    }
  }, [location.state, setItems]);

  const clearCart = async () => {
    if (!user) return;
    
    try {
      const cartRef = collection(db, "cartItems");
      const q = query(cartRef, where("userId", "==", user.uid));
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

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to place an order",
        variant: "destructive",
      });
      return;
    }

    if (!items.length) {
      toast({
        title: "Error",
        description: "No items in cart",
        variant: "destructive",
      });
      return;
    }

    try {
      await processOrderSubmission(
        items,
        total,
        paymentMethod,
        mobileMethod,
        bankDetails,
        customerInfo,
        false
      );
      
      await clearCart();
      setItems([]);
      
      toast({
        title: "Success",
        description: "Order placed successfully",
      });
      
      navigate("/orders");
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQuantityChange = (medicineId: string, newQuantity: number) => {
    const updatedItems = items.map(item => 
      item.medicineId === medicineId ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);
    
    // Recalculate total
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };

  const isSubmitDisabled = !paymentMethod || 
    (paymentMethod === "mobile" && !mobileMethod) ||
    (paymentMethod === "bank" && (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.transactionId)) ||
    !customerInfo.displayName ||
    !customerInfo.phoneNumber ||
    !customerInfo.address ||
    !customerInfo.email ||
    !items.length;

  return (
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
        onMobileDetailsChange={() => {}}
      />

      <OrderSummary
        items={items}
        total={total}
        loading={loading}
        onSubmit={handleSubmit}
        disabled={isSubmitDisabled}
        onQuantityChange={handleQuantityChange}
      />
    </div>
  );
};

export const CheckoutDialog = ({ isOpen, onClose }: CheckoutDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Checkout
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] px-1">
          <CheckoutProvider>
            <CheckoutContent />
          </CheckoutProvider>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};