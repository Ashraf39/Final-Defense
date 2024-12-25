interface CheckoutValidationProps {
  paymentMethod: string;
  mobileMethod: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    transactionId: string;
  };
  customerInfo: {
    displayName: string;
    phoneNumber: string;
    address: string;
    email: string;
  };
  items: any[];
}

export const useCheckoutValidation = ({
  paymentMethod,
  mobileMethod,
  bankDetails,
  customerInfo,
  items
}: CheckoutValidationProps) => {
  const isSubmitDisabled = !paymentMethod || 
    (paymentMethod === "mobile" && !mobileMethod) ||
    (paymentMethod === "bank" && (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.transactionId)) ||
    !customerInfo.displayName ||
    !customerInfo.phoneNumber ||
    !customerInfo.address ||
    !customerInfo.email ||
    !items.length;

  return { isSubmitDisabled };
};