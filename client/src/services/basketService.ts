import http from "./http-common";

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  product_image: string;
}

export interface CartItemQuantityUpdate {
  id: number;
  quantity: number;
}

const baseUrl = "api/baskets";

const getCartItems = () => {
  return http.get(`${baseUrl}`);
};

const updateQuantity = (id: number, quantity: number) => {
  return http.patch(`${baseUrl}/${id}`, { quantity });
};

const removeItem = (id: number) => {
  return http.delete(`${baseUrl}/${id}`);
};

const basketService = {
  getCartItems,
  updateQuantity,
  removeItem,
};

export default basketService;