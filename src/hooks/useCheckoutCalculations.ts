import { useState } from 'react';
import { OrderItem } from '@/types/order';

export const useCheckoutCalculations = (initialItems: OrderItem[] = []) => {
  const [items, setItems] = useState<OrderItem[]>(initialItems);

  const calculateTotal = (items: OrderItem[]): number => {
    if (!items || items.length === 0) {
      return 0;
    }

    return items.reduce((sum, item) => {
      const price = parseFloat(item.price.toString());
      const quantity = parseInt(item.quantity.toString());
      
      if (isNaN(price) || isNaN(quantity)) {
        console.warn('Invalid price or quantity:', { price: item.price, quantity: item.quantity });
        return sum;
      }

      return sum + (price * quantity);
    }, 0);
  };

  const updateItemQuantity = (medicineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setItems(prevItems => 
      prevItems.map(item =>
        item.medicineId === medicineId 
          ? { ...item, quantity: parseInt(newQuantity.toString()) }
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