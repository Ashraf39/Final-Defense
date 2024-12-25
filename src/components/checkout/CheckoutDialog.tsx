import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomerInfoForm } from "./CustomerInfoForm";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { OrderSummary } from "./OrderSummary";
import { CheckoutProvider, useCheckout } from "@/contexts/CheckoutContext";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutContent = () => {
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
  } = useCheckout();

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
        loading={false}
        onSubmit={() => {}}
        disabled={
          !paymentMethod || 
          (paymentMethod === "mobile" && !mobileMethod) ||
          (paymentMethod === "bank" && (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.transactionId))
        }
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