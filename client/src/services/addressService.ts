import http from "./http-common";

export interface Address {
  id?: number;
  ao_id: number; // address option id
  number: string;
  road: string;
  subdistrict: string;
  district: string;
  province: string;
  code_zip: number;
  ao_id: number;
  number: string;
  road: string;
  subdistrict: string;
  district: string;
  province: string;
  code_zip: number;
  address_detail?: string;
}
  address_detail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAddressDto {

export interface UpdateAddressDto {
  number?: string;
  road?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  code_zip?: number;
  address_detail?: string;
}

const baseUrl = "api/addresses";

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