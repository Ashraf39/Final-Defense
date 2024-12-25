import { useState } from "react";
import { CheckoutDialog } from "@/components/checkout/CheckoutDialog";

export const Checkout = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    // Navigate back to previous page
    window.history.back();
  };

  return <CheckoutDialog isOpen={isOpen} onClose={handleClose} />;
};