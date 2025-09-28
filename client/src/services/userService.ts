import http from "./http-common";

<<<<<<< HEAD
export enum UserRole {
  OWNER = 'owner',
  USER = 'user',
}

export interface User {
  id?: number;
  user_name: string;
  user_lastname: string;
  user_imageUrl?: string;
  user_birth: Date;
  user_role: UserRole;
  tel: string;
  email: string;
  username: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface UpdateUserDto {
  user_name?: string;
  user_lastname?: string;
  user_imageUrl?: string;
  user_birth?: Date;
  user_role?: UserRole;
  tel?: string;
  email?: string;
=======
// User profile interface
interface UserProfile {
  id: number;
  username: string;
  user_name: string;
  user_lastname: string;
  email: string;
  phone?: string;
  created_at: string;
}

// User address interface
interface UserAddress {
  id: number;
  user_id: number;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  district: string;
  city: string;
  postal_code: string;
  is_default: boolean;
}

// Payment method interface
interface PaymentMethod {
  id: number;
  user_id: number;
  type: 'credit_card' | 'debit_card' | 'bank_account' | 'mobile_payment';
  provider: string; // Visa, Mastercard, Krungthai, etc.
  last_four: string;
  expiry_month?: string;
  expiry_year?: string;
  is_default: boolean;
}

// Order interface
interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'completed' | 'cancelled';
  order_date: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
>>>>>>> develop_frontend
}

const baseUrl = "api/user";

<<<<<<< HEAD
const getMe = () => {
  return http.get(`${baseUrl}/me`);
};

const getAllUsers = () => {
  return http.get(baseUrl);
};

const getUserById = (id: number) => {
  return http.get(`${baseUrl}/${id}`);
};

const updateUser = (id: number, userData: UpdateUserDto) => {
  return http.patch(`${baseUrl}/${id}`, userData);
};

const deleteUser = (id: number) => {
  return http.delete(`${baseUrl}/${id}`);
};

const userService = {
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
=======
const userService = {
  // Get user profile
  getProfile: () => http.get<UserProfile>(`${baseUrl}/profile`),
  
  // Update user profile
  updateProfile: (profileData: Partial<UserProfile>) => http.put<UserProfile>(`${baseUrl}/profile`, profileData),
  
  // Get user addresses
  getAddresses: () => http.get<UserAddress[]>(`${baseUrl}/addresses`),
  
  // Create new address
  createAddress: (addressData: Omit<UserAddress, 'id' | 'user_id'>) => 
    http.post<UserAddress>(`${baseUrl}/addresses`, addressData),
  
  // Update address
  updateAddress: (id: number, addressData: Partial<UserAddress>) => 
    http.put<UserAddress>(`${baseUrl}/addresses/${id}`, addressData),
  
  // Delete address
  deleteAddress: (id: number) => http.delete(`${baseUrl}/addresses/${id}`),
  
  // Set default address
  setDefaultAddress: (id: number) => http.put(`${baseUrl}/addresses/${id}/default`),
  
  // Get payment methods
  getPaymentMethods: () => http.get<PaymentMethod[]>(`${baseUrl}/payment-methods`),
  
  // Add payment method
  addPaymentMethod: (paymentData: Omit<PaymentMethod, 'id' | 'user_id'>) => 
    http.post<PaymentMethod>(`${baseUrl}/payment-methods`, paymentData),
  
  // Update payment method
  updatePaymentMethod: (id: number, paymentData: Partial<PaymentMethod>) => 
    http.put<PaymentMethod>(`${baseUrl}/payment-methods/${id}`, paymentData),
  
  // Delete payment method
  deletePaymentMethod: (id: number) => http.delete(`${baseUrl}/payment-methods/${id}`),
  
  // Set default payment method
  setDefaultPaymentMethod: (id: number) => http.put(`${baseUrl}/payment-methods/${id}/default`),
  
  // Get order history
  getOrderHistory: (limit: number = 10, offset: number = 0) => 
    http.get<{ orders: Order[], total: number }>(`${baseUrl}/orders?limit=${limit}&offset=${offset}`),
  
  // Get specific order details
  getOrder: (orderId: number) => http.get<Order>(`${baseUrl}/orders/${orderId}`),
>>>>>>> develop_frontend
};

export default userService;