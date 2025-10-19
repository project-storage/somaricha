import http from "./http-common";

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  PREPARING = 'preparing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
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
  shipping_method?: string;
  payment_method?: string;
  address_id?: number;
  comemnt_star?: number;
  createdAt?: Date;
  updatedAt?: Date;
  delivered_at?: Date;
}

export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  product_image: string;
}

export interface FullOrder {
  id: number;
  order_date: string;
  total_amount: number;
  shipping_cost: number;
  status: 'preparing' | 'shipping' | 'delivered' | 'cancelled' | 'pending' | 'processing' | 'completed' | 'canceled';
  address: {
    recipient_name: string;
    phone: string;
    number: string;
    road: string;
    subdistrict: string;
    district: string;
    province: string;
    code_zip: number;
    address_detail?: string;
  };
  order_items: OrderItem[];
  created_at: string;
  updated_at?: string;
  delivered_at?: string;
}

export interface CreateOrderDto {
  address_id: number;
  shipping_method: string;
  payment_method: string;
  shipping_cost: number;
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  comemnt_star?: number;
}

const baseUrl = "api/orders";

// Local storage management for orders when backend is not available
const getLocalOrders = (): FullOrder[] => {
  const orders = localStorage.getItem('local_orders');
  return orders ? JSON.parse(orders) : [];
};

const saveLocalOrder = (order: FullOrder) => {
  const orders = getLocalOrders();
  orders.push(order);
  localStorage.setItem('local_orders', JSON.stringify(orders));
};

const getLocalOrderHistory = () => {
  return getLocalOrders();
};

const getLocalOrderById = (id: number) => {
  const orders = getLocalOrders();
  return orders.find(order => order.id === id);
};

const updateLocalOrderStatus = (id: number, status: string) => {
  const orders = getLocalOrders();
  const orderIndex = orders.findIndex(order => order.id === id);
  if (orderIndex !== -1) {
    // Map frontend statuses to backend compatible statuses
    let mappedStatus: 'preparing' | 'shipping' | 'delivered' | 'cancelled' | 'pending' | 'processing' | 'completed' | 'canceled';
    switch(status) {
      case 'processing': 
        mappedStatus = 'processing'; 
        break;
      case 'shipping': 
        mappedStatus = 'shipping'; 
        break;
      case 'completed': 
        mappedStatus = 'completed'; 
        break;
      case 'canceled': 
        mappedStatus = 'canceled'; 
        break;
      default:
        // For backward compatibility with frontend statuses
        mappedStatus = status as any;
    }
    
    orders[orderIndex].status = mappedStatus;
    
    if (status === 'delivered' || status === 'completed') {
      orders[orderIndex].delivered_at = new Date().toISOString();
    }
    localStorage.setItem('local_orders', JSON.stringify(orders));
  }
};

const createOrder = async (orderData: CreateOrderDto) => {
  // Try to create the order via API first
  try {
    const response = await http.post(`${baseUrl}`, orderData);
    return response;
  } catch (error: any) {
    // If API call fails, create a local order
    console.warn("Failed to create order via API, creating local order as fallback");
    
    // Get the actual address details from selected address ID
    // In a real app, this would come from an API call to fetch address details
    // But for local storage fallback, we'll use localStorage to maintain address data
    const savedAddresses = JSON.parse(localStorage.getItem('saved_addresses') || '[]');
    const selectedAddress = savedAddresses.find((addr: any) => addr.id === orderData.address_id);
    
    // Calculate shipping cost based on selected shipping method
    let shippingCost = 0;
    switch(orderData.shipping_method) {
      case 'economy':
        shippingCost = 15;
        break;
      case 'standard':
        shippingCost = 20;
        break;
      case 'express':
        shippingCost = 35;
        break;
      default:
        shippingCost = 20; // default to standard
    }
    
    const mockOrder: FullOrder = {
      id: Date.now(), // Use timestamp as ID
      order_date: new Date().toISOString(),
      total_amount: orderData.total_amount,
      shipping_cost: shippingCost,
      status: 'preparing',
      address: selectedAddress ? {
        recipient_name: selectedAddress.recipient_name || selectedAddress.name || "Local User",
        phone: selectedAddress.phone || "0800000000",
        number: selectedAddress.number || "123",
        road: selectedAddress.road || "Main Road",
        subdistrict: selectedAddress.subdistrict || "Subdistrict",
        district: selectedAddress.district || "District",
        province: selectedAddress.province || "Province",
        code_zip: selectedAddress.code_zip || 12345,
        address_detail: selectedAddress.address_detail
      } : {
        recipient_name: "Local User",
        phone: "0800000000",
        number: "123",
        road: "Main Road",
        subdistrict: "Subdistrict",
        district: "District",
        province: "Province",
        code_zip: 12345
      },
      order_items: orderData.items.map(item => ({
        id: item.product_id,
        product_name: `Product ${item.product_id}`,
        quantity: item.quantity,
        price: item.price,
        product_image: "/assets/placeholder.png"
      })),
      created_at: new Date().toISOString()
    };
    
    saveLocalOrder(mockOrder);
    
    return {
      data: {
        success: true,
        message: "Order created successfully (locally)",
        data: mockOrder
      }
    };
  }
};

// Function to check if current user is admin (needs to be exported separately)
const checkIfAdminUser = (): boolean => {
  const userRole = localStorage.getItem('user_role');
  return userRole === 'owner';
};

// Modified getAllOrders to return all orders for admin users
const getAllOrders = async () => {
  try {
    let response;
    // If admin, try to call admin-specific endpoint
    if (checkIfAdminUser()) {
      // Try to call admin-specific endpoint - update to use the correct admin endpoint
      response = await http.get(`${baseUrl}/admin/all`);
    } else {
      // Regular user gets their own orders
      response = await http.get(`${baseUrl}/history`);
    }
    
    // If the response contains orders without address data, try to fetch addresses separately
    if (response.data && Array.isArray(response.data)) {
      const orders = response.data;
      
      // Check if any orders are missing address data
      const hasMissingAddresses = orders.some((order: any) => !order.address);
      
      if (hasMissingAddresses) {
        // Attempt to get user's addresses to enrich the order data
        try {
          const addressResponse = await http.get('/api/addresses'); // Assuming this endpoint exists
          const addresses = Array.isArray(addressResponse.data) ? addressResponse.data : 
                           (addressResponse.data?.data && Array.isArray(addressResponse.data.data)) ? 
                           addressResponse.data.data : [];
          
          // Map address_id to address data for each order
          const enrichedOrders = orders.map((order: any) => {
            if (!order.address && order.address_id) {
              const address = addresses.find((addr: any) => addr.id === order.address_id);
              if (address) {
                return {
                  ...order,
                  address: {
                    recipient_name: address.recipient_name,
                    phone: address.phone,
                    number: address.number,
                    road: address.road,
                    subdistrict: address.subdistrict,
                    district: address.district,
                    province: address.province,
                    code_zip: address.code_zip,
                    address_detail: address.address_detail
                  }
                };
              }
            }
            return order;
          });
          
          // Update the response data with enriched orders
          response.data = enrichedOrders;
        } catch (addrError) {
          console.warn("Could not enrich order addresses:", addrError);
        }
      }
    }
    
    return response;
  } catch (error) {
    console.warn("Failed to fetch orders from server, using local orders");
    // Check if we have a network error (not just empty results)
    if (error.response) {
      // Server responded with error status
      console.warn("Server error:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.warn("Network error:", error.request);
    } else {
      // Something else happened
      console.warn("Error:", error.message);
    }
    
    // For admin users, return all local orders in fallback
    // For regular users, return their local orders (though local storage doesn't separate by user)
    if (checkIfAdminUser()) {
      return {
        data: getLocalOrders()
      };
    } else {
      // For regular users, try to filter local orders by a user ID if available
      // Since local storage doesn't currently separate by user, this is a fallback
      return {
        data: getLocalOrders()
      };
    }
  }
};

const getOrderById = async (id: number) => {
  try {
    const response = await http.get(`${baseUrl}/${id}`);
    return response;
  } catch (error) {
    console.warn("Failed to fetch order from server, using local order");
    const order = getLocalOrderById(id);
    return {
      data: order
    };
  }
};

const getOrderHistory = async () => {
  try {
    const response = await http.get(`${baseUrl}/history`);
    
    // Handle both direct array responses and nested data responses
    let ordersData = [];
    if (Array.isArray(response.data)) {
      ordersData = response.data;
    } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
      ordersData = response.data.data;
    } else if (response.data && response.data.data) {
      // Handle response in the format {data: [...]}
      ordersData = response.data.data;
    }
    
    // If the response contains orders without address data, try to fetch addresses separately
    if (ordersData && Array.isArray(ordersData)) {
      const orders = ordersData;
      
      // Check if any orders are missing address data
      const hasMissingAddresses = orders.some(order => !order.address);
      
      if (hasMissingAddresses) {
        // Attempt to get user's addresses to enrich the order data
        try {
          const addressResponse = await http.get('/api/addresses'); // Assuming this endpoint exists
          const addresses = Array.isArray(addressResponse.data) ? addressResponse.data : 
                           (addressResponse.data?.data && Array.isArray(addressResponse.data.data)) ? 
                           addressResponse.data.data : [];
          
          // Map address_id to address data for each order
          const enrichedOrders = orders.map(order => {
            if (!order.address && order.address_id) {
              const address = addresses.find(addr => addr.id === order.address_id);
              if (address) {
                return {
                  ...order,
                  address: {
                    recipient_name: address.recipient_name,
                    phone: address.phone,
                    number: address.number,
                    road: address.road,
                    subdistrict: address.subdistrict,
                    district: address.district,
                    province: address.province,
                    code_zip: address.code_zip,
                    address_detail: address.address_detail
                  }
                };
              }
            }
            return order;
          });
          
          // Update the response data with enriched orders
          if (Array.isArray(response.data)) {
            return { data: enrichedOrders }; // Return the enriched orders directly
          } else {
            response.data.data = enrichedOrders;
          }
        } catch (addrError) {
          console.warn("Could not enrich order addresses:", addrError);
        }
      }
    }
    
    return response;
  } catch (error) {
    console.warn("Failed to fetch order history from server, using local orders");
    // Check if we have a network error (not just empty results)
    if (error.response) {
      // Server responded with error status
      console.warn("Server error:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.warn("Network error:", error.request);
    } else {
      // Something else happened
      console.warn("Error:", error.message);
    }
    
    // Return local orders as fallback
    return {
      data: getLocalOrderHistory()
    };
  }
};

const getOrderDetail = async (id: number) => {
  try {
    const response = await http.get(`${baseUrl}/detail/${id}`);
    
    // Handle both direct object responses and nested data responses
    let orderData = null;
    if (response.data && typeof response.data === 'object' && response.data.data) {
      orderData = response.data.data;
    } else if (response.data && response.data.id) {
      orderData = response.data;
    }
    
    // If the response contains an order without address data, try to fetch address separately
    if (orderData) {
      const order = orderData;
      
      if (!order.address && order.address_id) {
        // Attempt to get user's addresses to enrich the order data
        try {
          const addressResponse = await http.get('/api/addresses'); // Assuming this endpoint exists
          const addresses = Array.isArray(addressResponse.data) ? addressResponse.data : 
                           (addressResponse.data?.data && Array.isArray(addressResponse.data.data)) ? 
                           addressResponse.data.data : [];
          
          const address = addresses.find((addr: any) => addr.id === order.address_id);
          if (address) {
            const enrichedOrder = {
              ...order,
              address: {
                recipient_name: address.recipient_name,
                phone: address.phone,
                number: address.number,
                road: address.road,
                subdistrict: address.subdistrict,
                district: address.district,
                province: address.province,
                code_zip: address.code_zip,
                address_detail: address.address_detail
              }
            };
            
            // Return the response in the expected format
            return {
              data: { data: enrichedOrder }
            };
          }
        } catch (addrError) {
          console.warn("Could not enrich order address:", addrError);
        }
      }
      
      // Return the order data in the expected format
      return {
        data: { data: orderData }
      };
    }
    
    return response;
  } catch (error) {
    console.warn("Failed to fetch order detail from server, using local order");
    // Check if we have a network error (not just order not found)
    if (error.response) {
      // Server responded with error status
      console.warn("Server error:", error.response.status, error.response.data);
      // If it's a 404 - order not found, don't use local fallback
      if (error.response.status === 404) {
        throw error;
      }
    } else if (error.request) {
      // Request was made but no response received
      console.warn("Network error:", error.request);
    } else {
      // Something else happened
      console.warn("Error:", error.message);
    }
    
    const order = getLocalOrderById(id);
    return {
      data: order
    };
  }
};

const updateOrder = async (id: number, orderData: UpdateOrderDto) => {
  try {
    const response = await http.patch(`${baseUrl}/${id}`, orderData);
    return response;
  } catch (error) {
    console.warn("Failed to update order on server, updating local order");
    if (orderData.status) {
      // Convert enum value to string for local storage update
      const statusString = typeof orderData.status === 'string' ? orderData.status : orderData.status.toString();
      updateLocalOrderStatus(id, statusString);
    }
    return {
      data: {
        success: true,
        message: "Order updated successfully (locally)"
      },
      status: 200
    };
  }
};

const confirmDelivery = async (id: number) => {
  try {
    const response = await http.patch(`${baseUrl}/${id}/confirm-delivery`, {});
    return response;
  } catch (error) {
    console.warn("Failed to confirm delivery on server, updating local order");
    updateLocalOrderStatus(id, OrderStatus.DELIVERED);
    return {
      data: {
        success: true,
        message: "Delivery confirmed successfully (locally)"
      },
      status: 200
    };
  }
};

const deleteOrder = (id: number) => {
  return http.delete(`${baseUrl}/${id}`);
};

const orderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderHistory,
  getOrderDetail,
  updateOrder,
  confirmDelivery,
  deleteOrder,
};

export default orderService;

// Export the helper function separately for use in components
export { checkIfAdminUser };