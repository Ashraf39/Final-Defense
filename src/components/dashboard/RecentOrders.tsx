import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/dashboard";
import { OrderDetailsDialog } from "./OrderDetailsDialog";

interface RecentOrdersProps {
  orders: Order[];
}

export const RecentOrders = ({ orders }: RecentOrdersProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const handleViewOrder = (invoiceNumber: string) => {
    setSelectedInvoice(invoiceNumber);
  };

  const handleCloseDialog = () => {
    setSelectedInvoice(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-4 border rounded">
                  <div>
                    <p className="font-medium">Invoice #{order.invoiceNumber}</p>
                    <p className="text-sm text-muted-foreground">BDT {order.total?.toFixed(2)}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handleViewOrder(order.invoiceNumber)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent orders</p>
          )}
        </CardContent>
      </Card>

      <OrderDetailsDialog 
        invoiceNumber={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={handleCloseDialog}
      />
    </>
  );
};