import { useState } from 'react';
import { OrderItem } from '@/types/order';

export const useCheckoutCalculations = (initialItems: OrderItem[] = []) => {
  const [items, setItems] = useState<OrderItem[]>(initialItems);

  const calculateTotal = (items: OrderItem[]): number => {
    console.log('Starting total calculation with items:', items);
    
    if (!items || items.length === 0) {
      console.log('No items to calculate total');
      return 0;
    }

    const total = items.reduce((sum, item) => {
      // Ensure price and quantity are numbers
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      
      if (isNaN(price) || isNaN(quantity)) {
        console.warn('Invalid price or quantity for item:', item);
        return sum;
      }

      const itemTotal = price * quantity;
      console.log(`Item ${item.name}: ${price} * ${quantity} = ${itemTotal}`);
      
      return sum + itemTotal;
    }, 0);

    console.log('Final calculated total:', total);
    return total;
  };

  const updateItemQuantity = (medicineId: string, newQuantity: number) => {
    console.log('Updating quantity for medicine:', { medicineId, newQuantity });
    
    if (newQuantity < 1) {
      console.warn('Attempted to set invalid quantity:', newQuantity);
      return;
    }

    setItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.medicineId === medicineId 
          ? { ...item, quantity: Number(newQuantity) }
          : item
      );
      
      console.log('Updated items:', updatedItems);
      return updatedItems;
    });
  };

  const total = calculateTotal(items);

  return {
    items,
    setItems,
    total,
    updateItemQuantity,
  };
};