import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomerInfoForm } from "./CustomerInfoForm";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { OrderSummary } from "./OrderSummary";
import { CheckoutProvider, useCheckout } from "@/contexts/CheckoutContext";
import { useOrderProcessing } from "@/hooks/useOrderProcessing";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useCartClear } from "@/hooks/useCartClear";
import { useCheckoutItems } from "@/hooks/useCheckoutItems";
import { useCheckoutValidation } from "./CheckoutValidation";

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

  const { total, setTotal } = useCheckoutItems(location, setItems);
  const { clearCart } = useCartClear(user?.uid);
  const { loading, processOrderSubmission } = useOrderProcessing(user?.uid || '');
  const { isSubmitDisabled } = useCheckoutValidation({
    paymentMethod,
    mobileMethod,
    bankDetails,
    customerInfo,
    items
  });

  // Check if we're coming from the cart page
  const isFromCartPage = location.pathname === '/cart';

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
      
      // Only clear the cart if we're checking out from the cart page
      if (isFromCartPage) {
        await clearCart();
      }
      
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
    
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };

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