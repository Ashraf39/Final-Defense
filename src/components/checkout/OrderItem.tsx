interface OrderItemProps {
  name: string;
  quantity: number;
  price: number;
  onQuantityChange: (quantity: number) => void;
}

export const OrderItem = ({ name, quantity, price, onQuantityChange }: OrderItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-600">
          Quantity: {quantity} box{quantity === 1 ? '' : 'es'}
        </p>
      </div>
      <p className="font-medium">BDT {(price * quantity).toFixed(2)}</p>
    </div>
  );
};