import http from "./http-common";

export interface Address {
  id?: number;
  ao_id: number; // address option id
  recipient_name?: string;
  phone?: string;
  number: string;
  road: string;
  subdistrict: string;
  district: string;
  province: string;
  code_zip: number;
  address_detail?: string;
  createdAt?: Date;
  updatedAt?: Date;
  addressOption?: {
    id: number;
    ao_name: string;
  };
}

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

const baseUrl = "/addresses";

const createAddress = (addressData: CreateAddressDto) => {
  return http.post(baseUrl, addressData);
};

const getAllAddresses = () => {
  return http.get(baseUrl);
};

const getAddressById = (id: number) => {
  return http.get(`${baseUrl}/${id}`);
};

const updateAddress = (id: number, addressData: UpdateAddressDto) => {
  return http.patch(`${baseUrl}/${id}`, addressData);
};

const deleteAddress = (id: number) => {
  return http.delete(`${baseUrl}/${id}`);
};

const addressService = {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};

export default addressService;
