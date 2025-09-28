import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";
import { toast } from "react-toastify";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'completed' | 'cancelled';
  order_date: string;
  items: OrderItem[];
}

const HistoryOrders: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
  });

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn, pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const offset = (pagination.page - 1) * pagination.limit;
      const response = await userService.getOrderHistory(pagination.limit, offset);
      
      setOrders(response.data.orders);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
      }));
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'preparing':
        return 'bg-purple-500';
      case 'ready_for_pickup':
        return 'bg-indigo-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(pagination.total / pagination.limit)) {
      setPagination(prev => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8C6E63]"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Please log in to view your order history</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D6C0B3] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#8C6E63] mb-8 text-center">Order History</h1>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">Order #{order.order_number}</h2>
                      <p className="text-gray-600">
                        {new Date(order.order_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="ml-4 text-lg font-bold">฿{order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Items:</h3>
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>
                            {item.quantity} x {item.product_name}
                          </span>
                          <span>฿{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="text-[#8C6E63] font-medium hover:underline"
                  >
                    {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                  </button>

                  {selectedOrder?.id === order.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h3 className="font-medium mb-2">Order Details:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><span className="font-medium">Order Number:</span> {order.order_number}</p>
                          <p><span className="font-medium">Order Date:</span> {new Date(order.order_date).toLocaleString()}</p>
                          <p><span className="font-medium">Status:</span> {getStatusText(order.status)}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Total Amount:</span> ฿{order.total_amount.toFixed(2)}</p>
                          <p><span className="font-medium">Items Count:</span> {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                          <p><span className="font-medium">Payment Status:</span> Paid</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="flex justify-center items-center mt-8">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-4 py-2 rounded-l-lg ${
                      pagination.page === 1 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-[#8C6E63] text-white hover:bg-[#6b584b]'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1 mx-2">
                    {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-full ${
                          pagination.page === page
                            ? 'bg-[#8C6E63] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                    className={`px-4 py-2 rounded-r-lg ${
                      pagination.page === Math.ceil(pagination.total / pagination.limit)
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-[#8C6E63] text-white hover:bg-[#6b584b]'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">You have no order history yet. Place your first order!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryOrders;