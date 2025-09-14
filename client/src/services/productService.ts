// services/productService.ts
import http from "./http-common";

export enum ProductStatus {
  IN_STOCK = "in stock",
  OUT_STOCK = "out stock",
}

export interface Product {
  id?: number; 
  product_name: string;
  product_detail: string;
  product_price: number;
  product_image?: string;
  product_status: ProductStatus;
}

const baseUrl = "api/products";

const addProduct = (product: Product) => {
  return http.post(baseUrl, product);
};

const getAllProducts = () => {
  return http.get(baseUrl);
};

const getProductById = (id: number) => {
  return http.get(`${baseUrl}/${id}`);
};

const updateProduct = (id: number, product: Product) => {
  return http.put(`${baseUrl}/${id}`, product);
};

const deleteProduct = (id: number) => {
  return http.delete(`${baseUrl}/${id}`);
};

const productService = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

export default productService;
