import { Loader2 } from "lucide-react";

export const OrderLoadingState = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};