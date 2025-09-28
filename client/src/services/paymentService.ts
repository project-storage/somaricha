import http from "./http-common";

export enum PaymentStatus {
  ONLY_CASE = 'only case',
  CREDIT_CARD = 'credit card',
  MOBILE_BANKING = 'mobile banking',
}

export interface Payment {
  id?: number;
  payment_name: PaymentStatus;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreatePaymentDto {
  payment_name: PaymentStatus;
}

export interface UpdatePaymentDto {
  payment_name?: PaymentStatus;
}

const baseUrl = "api/payment";

const createPayment = (paymentData: CreatePaymentDto) => {
  return http.post(baseUrl, paymentData);
};

const getAllPayments = () => {
  return http.get(baseUrl);
};

const updatePayment = (id: number, paymentData: UpdatePaymentDto) => {
  return http.patch(`${baseUrl}/${id}`, paymentData);
};

const deletePayment = (id: number) => {
  return http.delete(`${baseUrl}/${id}`);
};

const paymentService = {
  createPayment,
  getAllPayments,
  updatePayment,
  deletePayment,
};

export default paymentService;