import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
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

const OrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const authContext = useAuth();
  const [order, setOrder] = useState<(Order & { comemnt_star?: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (authContext.isLoggedIn && id) {
      fetchOrderDetail();
    }
  }, [authContext.isLoggedIn, id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      
      const orderId = parseInt(id || '');
      
      if (isNaN(orderId)) {
        toast.error("ไม่พบข้อมูลคำสั่งซื้อ");
        navigate('/order-history');
        return;
      }
      
      const response = await orderService.getOrderDetail(orderId);
      let orderData = null;
      
      if (response.data && response.data.data) {
        orderData = response.data.data;
      } else if (response.data && response.data.id) {
        // Direct order object
        orderData = response.data;
      } else if (response.data && typeof response.data === 'object' && response.data.id) {
        // Alternative format
        orderData = response.data;
      }
      
      if (orderData) {
        setOrder(orderData);
      } else {
        // Try to load from localStorage if API fails
        const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
        const localOrder = localOrders.find((o: any) => o.id === orderId);
        if (localOrder) {
          setOrder(localOrder);
        } else {
          toast.error("ไม่พบข้อมูลคำสั่งซื้อ");
          navigate('/order-history');
        }
      }
    } catch (error: any) {
      console.error("Error fetching order detail:", error);
      
      // Try to load from localStorage if API fails
      try {
        const orderId = parseInt(id || '');
        const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
        const localOrder = localOrders.find((o: any) => o.id === orderId);
        
        if (localOrder) {
          setOrder(localOrder);
          toast.info("กำลังแสดงข้อมูลจาก local storage");
        } else {
          if (error.response?.status === 401) {
            toast.error("กรุณาเข้าสู่ระบบอีกครั้ง");
            navigate('/login');
          } else if (error.response?.status === 404) {
            toast.error("ไม่พบคำสั่งซื้อนี้");
            navigate('/order-history');
          } else {
            toast.error(`ไม่สามารถโหลดรายละเอียดคำสั่งซื้อได้: ${error.message || 'เกิดข้อผิดพลาด'}`);
            navigate('/order-history');
          }
        }
      } catch (localError) {
        console.warn("Could not load local order:", localError);
        if (error.response?.status === 401) {
          toast.error("กรุณาเข้าสู่ระบบอีกครั้ง");
          navigate('/login');
        } else if (error.response?.status === 404) {
          toast.error("ไม่พบคำสั่งซื้อนี้");
          navigate('/order-history');
        } else {
          toast.error(`ไม่สามารถโหลดรายละเอียดคำสั่งซื้อได้: ${error.message || 'เกิดข้อผิดพลาด'}`);
          navigate('/order-history');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (stars: number) => {
    if (!order) return;
    
    try {
      await orderService.markAsReceived(order.id, stars);
      toast.success("ยืนยันการรับสินค้าและให้คะแนนเรียบร้อย");
      setShowRatingModal(false);
      // Refresh the order
      fetchOrderDetail();
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

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">ไม่พบคำสั่งซื้อ</h1>
          <button 
            onClick={() => navigate('/order-history')}
            className="mt-4 px-6 py-2 bg-[#8C6E63] text-white rounded-lg"
          >
            กลับไปยังประวัติการสั่งซื้อ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">รายละเอียดคำสั่งซื้อ</h1>
          <button 
            onClick={() => navigate('/order-history')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            กลับ
          </button>
        </div>

        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-black">คำสั่งซื้อ #{order.id}</div>
            <div className={`text-lg font-semibold ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-gray-600">วันที่สั่ง:</div>
              <div className="text-black">
                {order.created_at ? new Date(order.created_at).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'N/A'}
              </div>
            </div>
            
            {order.delivered_at && (
              <div>
                <div className="text-gray-600">วันที่จัดส่งเสร็จ:</div>
                <div className="text-black">
                  {order.delivered_at ? new Date(order.delivered_at).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h2 className="text-xl font-bold text-black mb-4">ที่อยู่จัดส่ง</h2>
          <div className="bg-white rounded-[25px] shadow-lg p-6">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="mr-3 mt-1">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              <div>
                <div className="text-black text-xl font-medium">
                  {order.address?.recipient_name || 'N/A'} - {order.address?.phone || 'N/A'}
                </div>
                <div className="text-gray-600 mt-1">
                  {order.address?.number || ''} ถ. {order.address?.road || ''}, {order.address?.subdistrict || ''}, 
                  {order.address?.district || ''}, {order.address?.province || ''} {order.address?.code_zip || ''}
                  {order.address?.address_detail && ` - ${order.address.address_detail}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4">รายการสินค้า</h2>
          <div className="space-y-4">
            {order.order_items?.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow flex items-center">
                <img 
                  src={item.product_image} 
                  alt={item.product_name}
                  className="w-16 h-16 object-contain rounded mr-4"
                />
                <div className="flex-1">
                  <div className="font-medium text-black">{item.product_name}</div>
                </div>
                <div className="text-gray-600">
                  จำนวน: {item.quantity}
                </div>
                <div className="ml-4 text-black font-medium">
                  ฿{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h2 className="text-xl font-bold text-black mb-4">สรุปรายการ</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-black">ราคาสินค้า</span>
              <span className="text-black">
                ฿{(order.order_items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">ค่าจัดส่ง</span>
              <span className="text-black">฿{order.shipping_cost ? order.shipping_cost.toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-300">
              <span className="text-xl font-bold text-black">ยอดที่ต้องชำระทั้งหมด</span>
              <span className="text-xl font-bold text-black">฿{order.total_amount ? order.total_amount.toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Rating Display */}
        {order.comemnt_star !== undefined && order.comemnt_star !== null && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-100 rounded-xl text-center shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">คะแนนความพึงพอใจของคุณ</h3>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-3xl text-yellow-500">
                  {star <= (order.comemnt_star || 0) ? "★" : "☆"}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Retroactive Rating Option */}
        {(order.status === 'delivered' || order.status === 'completed') && (order.comemnt_star === undefined || order.comemnt_star === null) && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-100 rounded-xl text-center shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">คุณยังไม่ได้ให้คะแนนคำสั่งซื้อนี้</h3>
            <button
              onClick={() => {
                setRating(5);
                setShowRatingModal(true);
              }}
              className="px-6 py-2 bg-[#8C6E63] text-white rounded-[25px] font-bold shadow hover:bg-opacity-90 transition-opacity"
            >
              ให้คะแนนความพึงพอใจ
            </button>
          </div>
        )}

        {/* Action Button */}
        {order.status === 'shipping' && (
          <div className="mb-8 text-center">
            <button
              onClick={() => {
                setRating(5);
                setShowRatingModal(true);
              }}
              className="px-8 py-3 bg-[#8C6E63] text-white rounded-[25px] font-bold shadow-md hover:bg-opacity-95 transition-all duration-300"
            >
              ได้รับสินค้าแล้ว
            </button>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mb-10">
          <button 
            onClick={() => navigate('/order-history')}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-sm"
          >
            กลับไปยังประวัติการสั่งซื้อ
          </button>
        </div>
      </div>

      {/* Rating Dialog Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-[450px] rounded-[25px] shadow-2xl flex flex-col items-center p-8 relative border border-gray-100">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4 text-3xl shadow-sm">
              ★
            </div>
            
            <h3 className="text-2xl font-bold mb-2 text-black text-center">ให้คะแนนคำสั่งซื้อ</h3>
            <p className="text-gray-500 text-center mb-6 text-sm">ความพึงพอใจของคุณต่อเครื่องดื่ม Somaricha</p>
            
            <div className="flex gap-2 mb-8 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-4xl text-yellow-500 focus:outline-none hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  {star <= rating ? "★" : "☆"}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between w-full px-2 gap-4">
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="text-[16px] font-bold text-gray-500 hover:text-black bg-transparent border-none py-2 cursor-pointer transition-colors"
              >
                ยกเลิก
              </button>
              
              <button
                type="button"
                onClick={() => handleConfirmDelivery(rating)}
                className="px-6 py-3 bg-[#8C6E63] hover:bg-[#73584F] text-white text-[16px] font-bold rounded-[25px] shadow-md transition-all duration-300 cursor-pointer"
              >
                ยืนยันการรับและให้คะแนน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;