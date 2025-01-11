interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderItemsProps {
  items: OrderItem[];
}

export const OrderItems = ({ items }: OrderItemsProps) => {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-600">
              Quantity: {item.quantity} box{item.quantity === 1 ? '' : 'es'}
            </p>
          </div>
          <p className="font-medium">BDT {(item.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};