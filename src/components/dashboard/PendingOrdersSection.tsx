import { Order } from "@/types/order";
import { RecentOrders } from "./RecentOrders";

interface PendingOrdersSectionProps {
  orders: Order[];
  totalPendingOrders: number;
}

export const PendingOrdersSection = ({ orders, totalPendingOrders }: PendingOrdersSectionProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pending Orders</h2>
        <span className="text-sm text-muted-foreground">
          Total pending: {totalPendingOrders}
        </span>
      </div>
      <RecentOrders orders={orders} />
    </div>
  );
};