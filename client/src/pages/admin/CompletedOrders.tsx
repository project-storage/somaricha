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
  user_id: number;
  total_price: number;
  status: 'preparing' | 'shipping' | 'delivered' | 'cancelled';
  shipping_method: string;
  payment_method: string;
  created_at: string;
  delivered_at?: string;
  updated_at: string;
  order_items: OrderItem[];
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
}

const AdminCompletedOrders: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isLoggedIn && userRole === 'owner') {
      fetchCompletedOrders();
    } else {
      toast.error("คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้");
      navigate("/admin");
    }
  }, [isLoggedIn, userRole, navigate]);

  const fetchCompletedOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      let ordersData = [];
      
      if (Array.isArray(response.data)) {
        // Filter to only show completed and delivered orders
        ordersData = response.data.filter((order: any) => 
          order.status === 'completed' || order.status === 'delivered'
        );
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
        ordersData = response.data.data.filter((order: any) => 
          order.status === 'completed' || order.status === 'delivered'
        );
      } else {
        console.error("Unexpected API response format:", response);
        toast.error("ข้อมูลคำสั่งซื้อไม่อยู่ในรูปแบบที่ถูกต้อง");
        return;
      }
      
      setOrders(ordersData);
    } catch (error: any) {
      console.error("Error fetching completed orders:", error);
      
      if (error.response?.status === 401) {
        toast.error("กรุณาเข้าสู่ระบบอีกครั้ง");
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error("คุณไม่มีสิทธิ์ในการเข้าถึงข้อมูลนี้");
        navigate('/admin');
      } else if (error.response?.status === 500) {
        toast.error("เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์");
      } else {
        toast.error(`ไม่สามารถโหลดคำสั่งซื้อที่เสร็จสิ้นได้: ${error.message || 'เกิดข้อผิดพลาด'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'กำลังจัดเตรียม';
      case 'shipping': return 'กำลังจัดส่ง';
      case 'delivered': return 'จัดส่งเสร็จสิ้นแล้ว';
      case 'cancelled': return 'ออเดอร์ถูกยกเลิก';
      case 'completed': return 'เสร็จสิ้น';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'text-yellow-600';
      case 'shipping': return 'text-blue-600';
      case 'delivered': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchTerm) ||
    (order.address?.recipient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.address?.phone || '').includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8C6E63]"></div>
      </div>
    );
  }

  if (userRole !== 'owner') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">ประวัติคำสั่งซื้อที่เสร็จสิ้น</h1>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="ค้นหาคำสั่งซื้อ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {selectedOrder ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">รายละเอียดคำสั่งซื้อ #{selectedOrder.id}</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                กลับ
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-xl font-bold text-black mb-3">ข้อมูลลูกค้า</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-black"><span className="font-medium">ชื่อ:</span> {selectedOrder.address?.recipient_name || 'N/A'}</p>
                  <p className="text-black"><span className="font-medium">เบอร์โทร:</span> {selectedOrder.address?.phone || 'N/A'}</p>
                  <p className="text-black"><span className="font-medium">ID ผู้ใช้:</span> {selectedOrder.user_id}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-black mb-3">ที่อยู่จัดส่ง</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-black">
                    {selectedOrder.address?.number || ''} ถ. {selectedOrder.address?.road || ''}, 
                    {selectedOrder.address?.subdistrict || ''}, {selectedOrder.address?.district || ''}, 
                    {selectedOrder.address?.province || ''} {selectedOrder.address?.code_zip || ''}
                    {selectedOrder.address?.address_detail && ` - ${selectedOrder.address.address_detail}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-black mb-3">รายการสินค้า</h3>
              <div className="space-y-3">
                {selectedOrder.order_items?.map(item => (
                  <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={item.product_image} 
                      alt={item.product_name}
                      className="w-12 h-12 object-contain rounded mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-black">{item.product_name}</div>
                      <div className="text-gray-600">จำนวน: {item.quantity}</div>
                    </div>
                    <div className="text-black font-medium">
                      ฿{item.price * item.quantity}
                    </div>
                  </div>
                )) || <p className="text-gray-500">ไม่มีรายการสินค้า</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-xl font-bold text-black mb-3">ข้อมูลคำสั่งซื้อ</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-black"><span className="font-medium">วิธีจัดส่ง:</span> {selectedOrder.shipping_method}</p>
                  <p className="text-black"><span className="font-medium">วิธีชำระเงิน:</span> {selectedOrder.payment_method}</p>
                  <p className="text-black"><span className="font-medium">วันที่สั่ง:</span> {new Date(selectedOrder.created_at).toLocaleString('th-TH')}</p>
                  {selectedOrder.delivered_at && (
                    <p className="text-black"><span className="font-medium">วันที่จัดส่งเสร็จ:</span> {new Date(selectedOrder.delivered_at).toLocaleString('th-TH')}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-black mb-3">สถานะคำสั่งซื้อ</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className={`text-lg font-bold ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left text-black font-semibold">ID</th>
                  <th className="py-3 px-4 text-left text-black font-semibold">ลูกค้า</th>
                  <th className="py-3 px-4 text-left text-black font-semibold">วันที่สั่ง</th>
                  <th className="py-3 px-4 text-left text-black font-semibold">ยอดรวม</th>
                  <th className="py-3 px-4 text-left text-black font-semibold">สถานะ</th>
                  <th className="py-3 px-4 text-left text-black font-semibold">การกระทำ</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-black">{order.id}</td>
                    <td className="py-3 px-4 text-black">{order.address?.recipient_name || 'N/A'}</td>
                    <td className="py-3 px-4 text-black">
                      {new Date(order.created_at).toLocaleDateString('th-TH')}
                    </td>
                    <td className="py-3 px-4 text-black">฿{order.total_price}</td>
                    <td className={`py-3 px-4 font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1 bg-[#8C6E63] text-white rounded hover:bg-[#6b584b]"
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                ไม่มีคำสั่งซื้อที่เสร็จสิ้น
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCompletedOrders;