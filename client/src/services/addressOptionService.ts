import http from "./http-common";

export interface AddressOption {
  id?: number;
  user_id: number; // user id
  ao_name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAddressOptionDto {
  user_id: number;
  ao_name: string;
}

export interface UpdateAddressOptionDto {
  ao_name?: string;
}

const baseUrl = "api/address-options";

const createAddressOption = (addressOptionData: CreateAddressOptionDto) => {
  return http.post(baseUrl, addressOptionData);
};

const getAllAddressOptions = () => {
  return http.get(baseUrl);
};

const getAddressOptionById = (id: number) => {
  return http.get(`${baseUrl}/${id}`);
};

const updateAddressOption = (id: number, addressOptionData: UpdateAddressOptionDto) => {
  return http.patch(`${baseUrl}/${id}`, addressOptionData);
};

const deleteAddressOption = (id: number) => {
  return http.delete(`${baseUrl}/${id}`);
};

const addressOptionService = {
  createAddressOption,
  getAllAddressOptions,
  getAddressOptionById,
  updateAddressOption,
  deleteAddressOption,
};

export default addressOptionService;