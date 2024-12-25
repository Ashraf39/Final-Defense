import { useEffect, useState } from 'react';
import { OrderItem } from '@/types/order';

export const useCheckoutCalculations = (initialItems: OrderItem[] = []) => {
  const [items, setItems] = useState<OrderItem[]>(initialItems);
  const [total, setTotal] = useState(0);

  const calculateTotal = (items: OrderItem[]) => {
    console.log('Calculating total for items:', items);
    const calculatedTotal = items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      console.log(`Item ${item.name}: ${item.price} * ${item.quantity} = ${itemTotal}`);
      return sum + itemTotal;
    }, 0);
    console.log('Final calculated total:', calculatedTotal);
    return calculatedTotal;
  };

  const updateItemQuantity = (medicineId: string, quantity: number) => {
    console.log(`Updating quantity for medicine ${medicineId} to ${quantity}`);
    setItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.medicineId === medicineId ? { ...item, quantity } : item
      );
      console.log('Updated items after quantity change:', updatedItems);
      return updatedItems;
    });
  };

  useEffect(() => {
    if (items.length > 0) {
      console.log('Items changed, recalculating total:', items);
      const newTotal = calculateTotal(items);
      console.log('Setting new total:', newTotal);
      setTotal(newTotal);
    }
  }, [items]);

  return {
    items,
    setItems,
    total,
    updateItemQuantity
  };
};