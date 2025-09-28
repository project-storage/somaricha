import { useCart } from "./CartContext";
import { checkAuthAndAlert } from "../services/authUtils";

interface UseCartWithAuthReturn {
  addToCartWithAuth: (item: any) => void;
  updateQuantityWithAuth: (id: number, quantity: number) => void;
  removeFromCartWithAuth: (id: number) => void;
}

export const useCartWithAuth = (): UseCartWithAuthReturn => {
  const { addToCart, updateQuantity, removeFromCart } = useCart();

  const addToCartWithAuth = (item: any) => {
    if (!checkAuthAndAlert()) {
      return;
    }
    addToCart(item);
  };

  const updateQuantityWithAuth = (id: number, quantity: number) => {
    if (!checkAuthAndAlert()) {
      return;
    }
    updateQuantity(id, quantity);
  };

  const removeFromCartWithAuth = (id: number) => {
    if (!checkAuthAndAlert()) {
      return;
    }
    removeFromCart(id);
  };

  return {
    addToCartWithAuth,
    updateQuantityWithAuth,
    removeFromCartWithAuth
  };
};