import http from "./http-common";

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
}

// AddressOption interface - needed for creating addresses with proper ao_id
export interface AddressOption {
  id: number;
  user_id: number;
  ao_name: string;
  created_at?: Date;
  updated_at?: Date;
}

// Address interface - matches the backend Address entity
export interface UserAddress {
  id: number;
  ao_id: number;
  number: string;
  road: string;
  subdistrict: string;
  district: string;
  province: string;
  code_zip: number;
  address_detail?: string;
  isDefault: boolean;
  created_at?: Date;
  updated_at?: Date;
  addressOption?: {
    id: number;
    ao_name: string;
  };
}

// DTO interfaces for address operations - maps to backend expected format
export interface CreateAddressDto {
  ao_id: number;
  recipient_name?: string;
  phone?: string;
  number: string;
  road: string;
  subdistrict: string;
  district: string;
  province: string;
  code_zip: number;
  address_detail?: string;
}

export interface UpdateAddressDto {
  ao_id?: number;
  recipient_name?: string;
  phone?: string;
  number?: string;
  road?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  code_zip?: number;
  address_detail?: string;
  isDefault?: boolean;
}

const baseUrl = "/user";
const addressBaseUrl = "/addresses";

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

// AddressOption functions
const getAddressOptions = () => {
  return http.get('address-options');
};

// Address management functions
const getAddresses = () => {
  console.log('Calling GET /api/addresses API'); // Debug log
  return http.get(`${addressBaseUrl}`);
};

const createAddress = (addressData: CreateAddressDto) => {
  return http.post(`${addressBaseUrl}`, addressData);
};

const updateAddress = (id: number, addressData: UpdateAddressDto) => {
  return http.patch(`${addressBaseUrl}/${id}`, addressData);
};

const deleteAddress = (id: number) => {
  return http.delete(`${addressBaseUrl}/${id}`);
};

const setDefaultAddress = (id: number) => {
  return http.patch(`${addressBaseUrl}/${id}/default`, {});
};

const getProfile = () => {
  return http.get(`${baseUrl}/profile`);
};

const updateProfile = (profileData: any) => {
  // If user sets a phone number, map it to the backend expected field 'tel'
  const payload = {
    ...profileData,
    tel: profileData.phone !== undefined ? profileData.phone : profileData.tel
  };
  return http.patch(`${baseUrl}/profile`, payload);
};

const userService = {
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAddressOptions,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getProfile,
  updateProfile,
};

export default userService;