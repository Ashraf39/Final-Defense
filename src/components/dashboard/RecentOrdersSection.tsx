import { Order } from "@/types/order";
import { RecentOrders } from "./RecentOrders";

interface RecentOrdersSectionProps {
  orders: Order[];
}

export const RecentOrdersSection = ({ orders }: RecentOrdersSectionProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      <RecentOrders orders={orders} />
    </div>
  );
};