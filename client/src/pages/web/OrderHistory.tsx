import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import orderService from "../../services/orderService";
import { toast } from "react-toastify";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  product_image: string;
}

interface Order {
  id: number;
  order_date: string;
  total_amount: number;
  shipping_cost: number;
  status: 'pending' | 'processing' | 'preparing' | 'shipping' | 'delivered' | 'completed' | 'canceled' | 'cancelled';
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

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const isLoggedIn = authContext.isLoggedIn;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authContext.isLoggedIn) {
      fetchOrderHistory();
    }
  }, [authContext.isLoggedIn]);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      console.log("Fetching order history for user...");
      
      // Clear localStorage before fetching to ensure we get fresh data
      localStorage.removeItem('local_orders');
      console.log("Cleared local_orders from localStorage");
      
      const response = await orderService.getOrderHistory();
      console.log("Order history response:", response);
      let ordersData = [];
      
      if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data.data)) {
        // Handle nested response structure
        ordersData = response.data.data.data;
      } else if (response.data && typeof response.data === 'object' && response.data.data) {
        // Handle direct response structure
        ordersData = response.data.data;
      } else {
        console.warn("Unexpected response format, using empty array:", response.data);
        ordersData = [];
      }
      
      console.log(`Loaded ${ordersData.length} orders for user`);
      setOrders(ordersData);
    } catch (error: any) {
      console.error("Error fetching order history:", error);
      
      // Check for authentication issues
      if (error.response?.status === 401) {
        toast.error("กรุณาเข้าสู่ระบบอีกครั้ง");
        // Optionally redirect to login
        // navigate('/login');
      } else if (error.response?.status === 500) {
        toast.error("เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองอีกครั้งภายหลัง");
      } else if (error.message) {
        toast.error(`ไม่สามารถโหลดประวัติคำสั่งซื้อได้: ${error.message}`);
      } else {
        toast.error("ไม่สามารถโหลดประวัติคำสั่งซื้อได้");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (orderId: number) => {
    try {
      await orderService.confirmDelivery(orderId);
      toast.success("ยืนยันการรับสินค้าเรียบร้อย");
      // Refresh the order list
      fetchOrderHistory();
    } catch (error) {
      console.error("Error confirming delivery:", error);
      toast.error("ยืนยันการรับสินค้าล้มเหลว");
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'รอดำเนินการ';
      case 'processing': return 'กำลังดำเนินการ';
      case 'preparing': return 'กำลังจัดเตรียม';
      case 'shipping': return 'กำลังจัดส่ง';
      case 'delivered': return 'จัดส่งเสร็จสิ้นแล้ว';
      case 'completed': return 'เสร็จสิ้น';
      case 'canceled': return 'ออเดอร์ถูกยกเลิก';
      case 'cancelled': return 'ออเดอร์ถูกยกเลิก'; // Alternative spelling
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-600';
      case 'processing': return 'text-yellow-600';
      case 'preparing': return 'text-yellow-600';
      case 'shipping': return 'text-blue-600';
      case 'delivered': return 'text-green-600';
      case 'completed': return 'text-green-600';
      case 'canceled': return 'text-red-600';
      case 'cancelled': return 'text-red-600'; // Alternative spelling
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8C6E63]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold text-black mb-12">ประวัติการสั่งซื้อ</h1>
      
      <div className="w-full max-w-[1200px]">
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="w-full max-w-[1200px] h-auto bg-white rounded-[25px] shadow-lg p-6 cursor-pointer"
                onClick={() => navigate(`/order-detail/${order.id}`)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <div className="text-black text-xl font-bold">
                      คำสั่งซื้อ #{order.id}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </div>
                    <div className="text-black font-medium mt-1">
                      ยอดรวม: ฿{order.total_amount ? order.total_amount.toFixed(2) : '0.00'}
                    </div>
                    <div className={`font-semibold mt-1 ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    {order.status === 'shipping' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmDelivery(order.id);
                        }}
                        className="px-6 py-2 bg-[#8C6E63] text-white rounded-lg"
                      >
                        ได้รับสินค้าแล้ว
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {order.order_items?.slice(0, 3).map((item, index) => (
                    <div key={index} className="w-16 h-16">
                      <img 
                        src={item.product_image} 
                        alt={item.product_name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                  {order.order_items && order.order_items.length > 3 && (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-gray-600">
                      +{order.order_items.length - 3}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-gray-600 text-sm">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2 mt-0.5">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                    <span>
                      จัดส่งไปที่: {order.address?.recipient_name || 'N/A'}, {order.address?.phone || 'N/A'} <br />
                      {order.address?.number || ''} ถ. {order.address?.road || ''}, 
                      {order.address?.subdistrict || ''}, {order.address?.district || ''}, {order.address?.province || ''} {order.address?.code_zip || ''}
                      {order.address?.address_detail && `, ${order.address.address_detail}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            ยังไม่มีประวัติการสั่งซื้อ
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;