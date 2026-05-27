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
  status:
    | 'preparing'
    | 'shipping'
    | 'delivered'
    | 'cancelled'
    | 'pending'
    | 'processing'
    | 'completed'
    | 'canceled';
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
  comemnt_star?: number;
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

const baseUrl = "orders";

// Helpers for localStorage with safe parsing
const safeParse = (value: string | null, fallback: any) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

// Local storage management for orders when backend is not available
const getLocalOrders = (): FullOrder[] => {
  const orders = safeParse(localStorage.getItem('local_orders'), []);
  return Array.isArray(orders) ? orders : [];
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
    // Map frontend statuses to FullOrder.status union
    let mappedStatus: FullOrder['status'];

    switch (status) {
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
      case 'cancelled':
        mappedStatus = 'canceled';
        break;
      case 'delivered':
        mappedStatus = 'delivered';
        break;
      case 'preparing':
        mappedStatus = 'preparing';
        break;
      case 'pending':
        mappedStatus = 'pending';
        break;
      default:
        // fallback: coerce to string and trust runtime
        mappedStatus = status as FullOrder['status'];
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
    // Prepare the order data to match the new backend structure
    const orderPayload = {
      status: 'pending', // default status
      orderdatetime: new Date().toISOString(), // current date/time
      payment_id: 1, // This might need to come from the payment selection
      total_price: orderData.total_amount,
      address_option: orderData.address_id, // Use address_id from frontend as address_option in backend
      items: orderData.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    const response = await http.post(`${baseUrl}`, orderPayload);
    return response;
  } catch (error) {
    // If API call fails, create a local order
    console.warn("Failed to create order via API, creating local order as fallback");

    // Get the actual address details from selected address ID
    const savedAddresses = safeParse(localStorage.getItem('saved_addresses'), []);
    const selectedAddress = Array.isArray(savedAddresses)
      ? savedAddresses.find((addr: any) => addr.id === orderData.address_id)
      : undefined;

    // Calculate shipping cost based on selected shipping method
    let shippingCost = 0;
    switch (orderData.shipping_method) {
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
      address: selectedAddress
        ? {
            recipient_name: selectedAddress.recipient_name || selectedAddress.name || "Local User",
            phone: selectedAddress.phone || "0800000000",
            number: selectedAddress.number || "123",
            road: selectedAddress.road || "Main Road",
            subdistrict: selectedAddress.subdistrict || "Subdistrict",
            district: selectedAddress.district || "District",
            province: selectedAddress.province || "Province",
            code_zip: selectedAddress.code_zip || 12345,
            address_detail: selectedAddress.address_detail
          }
        : {
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
      },
      status: 200
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
      response = await http.get(`${baseUrl}/admin/all`);
    } else {
      // Regular user gets their own orders
      response = await http.get(`${baseUrl}/history`);
    }

    // If the response contains orders without address data, try to fetch addresses separately
    if (response && response.data && Array.isArray(response.data)) {
      const orders = response.data;

      // Check if any orders are missing address data
      const hasMissingAddresses = orders.some((order: any) => !order.address);

      if (hasMissingAddresses) {
        try {
          const addressResponse = await http.get('/api/addresses'); // adjust if needed
          const addresses = Array.isArray(addressResponse.data)
            ? addressResponse.data
            : (addressResponse.data?.data && Array.isArray(addressResponse.data.data))
            ? addressResponse.data.data
            : [];

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

          response.data = enrichedOrders;
        } catch (addrError) {
          console.warn("Could not enrich order addresses:", addrError instanceof Error ? addrError.message : String(addrError));
        }
      }
    }

    return response;
  } catch (error) {
    console.warn("Failed to fetch orders from server, using local orders");

    if (error instanceof Error && 'response' in error) {
      console.warn("Server error:", (error as any).response?.status, (error as any).response?.data);
    } else if (error instanceof Error && 'request' in error) {
      console.warn("Network error:", (error as any).request);
    } else {
      console.warn("Error:", error instanceof Error ? error.message : String(error));
    }

    // Fallback to local orders
    return {
      data: getLocalOrders()
    };
  }
};

const getOrderById = async (id: number) => {
  try {
    const response = await http.get(`${baseUrl}/${id}`);
    return response;
  } catch (error: any) {
    console.warn("Failed to fetch order from server, using local order");
    const order = getLocalOrderById(id);
    return {
      data: order
    };
  }
};

const getOrderHistory = async () => {
  try {
    console.log("Making request to:", `${baseUrl}/history`);
    const response = await http.get(`${baseUrl}/history`);
    console.log("Raw response from server:", response);

    // Handle both direct array responses and nested data responses
    let ordersData: any[] = [];
    if (Array.isArray(response.data)) {
      ordersData = response.data;
      console.log("Order history response format: direct array with", response.data.length, "items");
    } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
      ordersData = response.data.data;
      console.log("Order history response format: nested data with", response.data.data.length, "items");
    } else if (response.data && response.data.data) {
      ordersData = response.data.data;
      console.log("Order history response format: nested data (backup check) with", response.data.data.length, "items");
    } else {
      console.warn("Unexpected order history response format", response);
      return response;
    }

    // If the response contains orders without address data, try to fetch addresses separately
    if (ordersData && Array.isArray(ordersData)) {
      const orders = ordersData;
      const hasMissingAddresses = orders.some(order => !order?.address);

      if (hasMissingAddresses) {
        try {
          const addressResponse = await http.get('/api/addresses'); // adjust as needed
          const addresses = Array.isArray(addressResponse.data)
            ? addressResponse.data
            : (addressResponse.data?.data && Array.isArray(addressResponse.data.data))
            ? addressResponse.data.data
            : [];

          const enrichedOrders = orders.map((order: any) => {
            if (!order?.address && order?.address_id) {
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

          // Normalize response shape
          return { data: enrichedOrders };
        } catch (addrError) {
          console.warn("Could not enrich order addresses:", addrError instanceof Error ? addrError.message : String(addrError));
        }
      }
    }

    console.log("Final processed orders data:", ordersData);
    return response;
  } catch (error) {
    console.error("Failed to fetch order history from server:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && 'response' in error) {
      console.error("Server error:", (error as any).response?.status, (error as any).response?.data);
    } else if (error instanceof Error && 'request' in error) {
      console.error("Network error: request made but no response received", (error as any).request);
    } else {
      console.error("General error:", error instanceof Error ? error.message : String(error));
    }

    console.warn("Using local order history as fallback");
    const localOrders = getLocalOrderHistory();
    console.log("Local orders available:", localOrders.length);
    return {
      data: localOrders
    };
  }
};

const getOrderDetail = async (id: number) => {
  try {
    const response = await http.get(`${baseUrl}/detail/${id}`);

    // Handle both direct object responses and nested data responses
    let orderData: any = null;
    if (response.data && typeof response.data === 'object' && response.data.data) {
      orderData = response.data.data;
    } else if (response.data && response.data.id) {
      orderData = response.data;
    }

    // If the response contains an order without address data, try to fetch address separately
    if (orderData) {
      const order = orderData;

      if (!order.address && order.address_id) {
        try {
          const addressResponse = await http.get('/api/addresses'); // adjust as needed
          const addresses = Array.isArray(addressResponse.data)
            ? addressResponse.data
            : (addressResponse.data?.data && Array.isArray(addressResponse.data.data))
            ? addressResponse.data.data
            : [];

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

            return {
              data: { data: enrichedOrder }
            };
          }
        } catch (addrError) {
          console.warn("Could not enrich order address:", addrError instanceof Error ? addrError.message : String(addrError));
        }
      }

      return {
        data: { data: orderData }
      };
    }

    return response;
  } catch (error) {
    console.warn("Failed to fetch order detail from server, using local order");
    if (error instanceof Error && 'response' in error) {
      console.warn("Server error:", (error as any).response?.status, (error as any).response?.data);
      if ((error as any).response?.status === 404) {
        throw error;
      }
    } else if (error instanceof Error && 'request' in error) {
      console.warn("Network error:", (error as any).request);
    } else {
      console.warn("Error:", error instanceof Error ? error.message : String(error));
    }

    const order = getLocalOrderById(id);
    return {
      data: order
    };
  }
};

const updateOrder = async (id: number, orderData: UpdateOrderDto) => {
  try {
    let response;
    // If the user is an admin and only updating status, call the admin status endpoint
    if (checkIfAdminUser() && orderData.status !== undefined) {
      response = await http.patch(`${baseUrl}/${id}/status`, { status: orderData.status });
    } else {
      response = await http.patch(`${baseUrl}/${id}`, orderData);
    }
    return response;
  } catch (error) {
    console.warn("Failed to update order on server, updating local order");

    if (orderData.status !== undefined) {
      // Use String() to coerce to safe string representation
      const statusString = String(orderData.status);
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

const markAsReceived = async (id: number, commentStar: number) => {
  try {
    const response = await http.patch(`${baseUrl}/${id}/received`, { comemnt_star: commentStar });
    return response;
  } catch (error) {
    console.warn("Failed to mark received on server, updating local order");
    updateLocalOrderStatus(id, OrderStatus.DELIVERED);
    
    // Update local order rating
    const orders = getLocalOrders();
    const orderIndex = orders.findIndex(order => order.id === id);
    if (orderIndex !== -1) {
      orders[orderIndex].comemnt_star = commentStar;
      localStorage.setItem('local_orders', JSON.stringify(orders));
    }
    return {
      data: {
        success: true,
        message: "Order marked as received with rating (locally)"
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
  markAsReceived,
  confirmDelivery,
  deleteOrder,
};

export default orderService;

// Export the helper function separately for use in components
export { checkIfAdminUser };
