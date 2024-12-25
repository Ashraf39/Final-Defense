import { useState, useEffect } from "react";
import { Location } from "react-router-dom";

interface CheckoutItem {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
}

export const useCheckoutItems = (
  location: Location,
  setItems: (items: CheckoutItem[]) => void
) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const state = location.state;
    if (state?.total) {
      console.log('Setting total from state:', state.total);
      setTotal(state.total);
    }
    if (state?.singleItem) {
      console.log('Processing single item purchase:', state.singleItem);
      const initialItems = [{
        medicineId: state.singleItem.medicineId,
        name: state.singleItem.name,
        quantity: Number(state.singleItem.quantity) || 1,
        price: Number(state.singleItem.price)
      }];
      console.log('Processed single item:', initialItems);
      setItems(initialItems);
      setTotal(initialItems[0].price * initialItems[0].quantity);
    } else if (state?.items && Array.isArray(state.items)) {
      console.log('Processing cart items:', state.items);
      const cartItems = state.items.map((item: any) => ({
        medicineId: item.medicineId,
        name: item.name,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price)
      }));
      console.log('Processed cart items:', cartItems);
      setItems(cartItems);
    }
  }, [location.state, setItems]);

  return { total, setTotal };
};