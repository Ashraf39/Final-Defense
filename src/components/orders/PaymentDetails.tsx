interface BankDetails {
  bankName: string;
  accountNumber: string;
  transactionId: string;
}

interface PaymentDetailsProps {
  paymentMethod: string;
  mobileMethod?: string;
  bankDetails?: BankDetails;
  total: number;
}

export const PaymentDetails = ({
  paymentMethod,
  mobileMethod,
  bankDetails,
  total,
}: PaymentDetailsProps) => {
  return (
    <div className="mt-4 pt-4 border-t">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">Payment Method</p>
          <p className="text-sm text-gray-600">
            {paymentMethod}
            {mobileMethod && ` (${mobileMethod})`}
          </p>
          {bankDetails && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Bank: {bankDetails.bankName}</p>
              <p>Account: {bankDetails.accountNumber}</p>
              <p>Transaction ID: {bankDetails.transactionId}</p>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="font-semibold">
            BDT {total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};