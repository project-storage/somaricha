// Export all services for easy import
export { default as authService } from './authService';
export { default as productService } from './productService';
export { default as userService } from './userService';
export { default as orderService } from './orderService';
export { default as paymentService } from './paymentService';
export { default as addressService } from './addressService';
export { default as addressOptionService } from './addressOptionService';

// Export main interfaces and types that are commonly used
// Avoid conflicts by explicitly specifying which types to export
export type { User, UserRole, UserAddress } from './userService';
export type { Product } from './productService';
export type { Order } from './orderService';
export type { Payment } from './paymentService';
export type { Address } from './addressService';
export type { AddressOption as AddressOptionType } from './addressOptionService';