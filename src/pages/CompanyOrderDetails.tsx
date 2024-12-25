import { useParams } from "react-router-dom";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderLoadingState } from "@/components/orders/OrderLoadingState";
import { OrderErrorState } from "@/components/orders/OrderErrorState";
import { useOrderDetails } from "@/hooks/useOrderDetails";

export const CompanyOrderDetails = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useOrderDetails(id);

  if (isLoading) {
    return <OrderLoadingState />;
  }

  if (!order) {
    return <OrderErrorState />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>
      <OrderCard 
        order={order} 
        isCompany={true}
      />
    </div>
  );
};