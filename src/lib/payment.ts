interface MobilePaymentConfig {
  phoneNumber: string;
  amount: number;
  method: 'bkash' | 'nagad' | 'rocket';
  transactionId?: string;
}

interface MobilePaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

export const processMobilePayment = async (config: MobilePaymentConfig): Promise<MobilePaymentResponse> => {
  // This is a mock implementation. In a real application, you would integrate with actual payment gateways
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      if (config.phoneNumber && config.amount > 0) {
        resolve({
          success: true,
          transactionId: `${config.method.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          message: `Payment processed successfully via ${config.method}`,
        });
      } else {
        reject(new Error('Invalid payment details'));
      }
    }, 2000);
  });
};