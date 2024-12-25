import { useState } from 'react';
import { OrderItem } from '@/types/order';

export const useCheckoutCalculations = (initialItems: OrderItem[] = []) => {
  const [items, setItems] = useState<OrderItem[]>(initialItems);

  // Helper function to ensure number type
  const ensureNumber = (value: string | number): number => {
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return value;
  };

  // Calculate single item total
  const calculateItemTotal = (item: OrderItem): number => {
    if (!item.price || !item.quantity) {
      console.warn('Invalid item data:', item);
      return 0;
    }

    const price = ensureNumber(item.price);
    const quantity = ensureNumber(item.quantity);
    
    const itemTotal = price * quantity;
    console.log(`Calculating total for ${item.name}:`, {
      price,
      quantity,
      itemTotal
    });
    
    return itemTotal;
  };

  // Calculate cart total
  const calculateTotal = (items: OrderItem[]): number => {
    console.log('Calculating total for items:', items);
    
    if (!items || items.length === 0) {
      console.log('No items to calculate total');
      return 0;
    }

    const total = items.reduce((sum, item) => {
      const itemTotal = calculateItemTotal(item);
      return sum + itemTotal;
    }, 0);

    console.log('Final calculated total:', total);
    return total;
  };

  // Update item quantity
  const updateItemQuantity = (medicineId: string, newQuantity: number) => {
    console.log('Updating quantity:', { medicineId, newQuantity });
    
    setItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.medicineId === medicineId 
          ? { ...item, quantity: ensureNumber(newQuantity) }
          : item
      );
      
      console.log('Items after quantity update:', updatedItems);
      return updatedItems;
    });
  };

  const total = calculateTotal(items);

  return {
    items,
    setItems,
    total,
    updateItemQuantity
  };
};