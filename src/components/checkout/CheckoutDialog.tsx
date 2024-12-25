import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomerInfoForm } from "./CustomerInfoForm";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { OrderSummary } from "./OrderSummary";
import { CheckoutProvider, useCheckout } from "@/contexts/CheckoutContext";
import { useOrderProcessing } from "@/hooks/useOrderProcessing";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

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
    setCustomerInfo,
    setPaymentMethod,
    setMobileMethod,
    setBankDetails,
    updateItemQuantity,
    setItems,
  } = useCheckout();

  const { loading, processOrderSubmission } = useOrderProcessing(user?.uid || '');

  // Initialize items from location state
  useEffect(() => {
    const state = location.state;
    if (state?.singleItem) {
      console.log('Setting single item:', state.singleItem); // Debug log
      setItems([state.singleItem]);
    }
  }, [location.state, setItems]);

  const handleSubmit = async () => {
    if (!user) return;
    
    await processOrderSubmission(
      items,
      total,
      paymentMethod,
      mobileMethod,
      bankDetails,
      customerInfo,
      false
    );
  };

  const isSubmitDisabled = !paymentMethod || 
    (paymentMethod === "mobile" && !mobileMethod) ||
    (paymentMethod === "bank" && (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.transactionId)) ||
    !customerInfo.displayName ||
    !customerInfo.phoneNumber ||
    !customerInfo.address ||
    !customerInfo.email;

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
        onQuantityChange={updateItemQuantity}
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