import http from "./http-common";

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export interface Order {
  id?: number;
  product_id: number;
  user_id: number;
  qty: number;
  status: OrderStatus;
  orderdatetime: Date;
  payment_id: number;
  total_price: number;
  comemnt_star?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOrderDto {
  product_id: number;
  user_id: number;
  qty: number;
  status: OrderStatus;
  orderdatetime: Date;
  payment_id: number;
  total_price: number;
  comemnt_star?: number;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  comemnt_star?: number;
}

const baseUrl = "api/orders";

const createOrder = (orderData: CreateOrderDto) => {
  return http.post(baseUrl, orderData);
};

const getAllOrders = () => {
  return http.get(baseUrl);
};

const getOrderById = (id: number) => {
  return http.get(`${baseUrl}/${id}`);
};

const updateOrder = (id: number, orderData: UpdateOrderDto) => {
  return http.patch(`${baseUrl}/${id}`, orderData);
};

const deleteOrder = (id: number) => {
  return http.delete(`${baseUrl}/${id}`);
};

const orderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};

export default orderService;