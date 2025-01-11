import { Order } from "@/types/order";
import { RecentOrders } from "./RecentOrders";

interface RecentOrdersSectionProps {
  orders: Order[];
}

export const RecentOrdersSection = ({ orders }: RecentOrdersSectionProps) => {
  return (
    <div>
      <RecentOrders orders={orders} />
    </div>
  );
};