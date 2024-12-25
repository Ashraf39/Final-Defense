import { useState } from 'react';
import { OrderItem } from '@/types/order';

export const useCheckoutCalculations = (initialItems: OrderItem[] = []) => {
  const [items, setItems] = useState<OrderItem[]>(initialItems);

  const calculateTotal = (items: OrderItem[]): number => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const updateItemQuantity = (medicineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setItems(prevItems => 
      prevItems.map(item =>
        item.medicineId === medicineId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const total = calculateTotal(items);

  return {
    items,
    setItems,
    total,
    updateItemQuantity,
  };
};