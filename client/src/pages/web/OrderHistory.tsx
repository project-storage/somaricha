import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import orderService from "../../services/orderService";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

// กำหนด interface สำหรับข้อมูลสินค้าในคำสั่งซื้อ
interface OrderItem {
  id: number;                // ไอดีของสินค้า
  product_name: string;      // ชื่อสินค้า
  quantity: number;          // จำนวนสินค้า
  price: number;             // ราคาต่อชิ้น
  product_image: string;     // ลิงก์รูปภาพสินค้า
}

// กำหนด interface สำหรับข้อมูลคำสั่งซื้อทั้งหมด
interface Order {
  id: number;                // ไอดีคำสั่งซื้อ
  order_date: string;        // วันที่สั่งซื้อ
  total_amount: number;      // ราคารวมทั้งหมด
  status: 'pending' | 'processing' | 'preparing' | 'shipping' | 'delivered' | 'completed' | 'canceled' | 'cancelled'; // สถานะคำสั่งซื้อ
  address: {                 // ข้อมูลที่อยู่จัดส่ง
    recipient_name: string;  // ชื่อผู้รับ
    phone: string;           // เบอร์โทรผู้รับ
    number: string;          // บ้านเลขที่
    road: string;            // ชื่อถนน
    subdistrict: string;     // ตำบล
    district: string;        // อำเภอ
    province: string;        // จังหวัด
    code_zip: number;        // รหัสไปรษณีย์
    address_detail?: string; // รายละเอียดที่อยู่ (ไม่บังคับ)
  };
  order_items: OrderItem[];  // รายการสินค้าในคำสั่งซื้อ
  created_at: string;        // วันที่สร้างคำสั่งซื้อ
  updated_at?: string;       // วันที่อัปเดตคำสั่งซื้อ (ไม่บังคับ)
  delivered_at?: string;     // วันที่ส่งของเสร็จ (ไม่บังคับ)
}

// ฟังก์ชันช่วยจัดการข้อผิดพลาด
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // หากเป็น AxiosError, คืนค่าข้อความจาก response หรือ message ของ error
    return error.response?.data?.message || error.message;
  } else if (error instanceof Error) {
    // หากเป็น Error object ทั่วไป, คืนค่า message
    return error.message;
  }
  // หากไม่ใช่ Error object, คืนค่าข้อความเริ่มต้น
  return "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
};

// Component หลักของหน้าประวัติการสั่งซื้อ
const OrderHistory: React.FC = () => {
  // ใช้ navigate สำหรับเปลี่ยนหน้า
  const navigate = useNavigate();
  
  // ดึงข้อมูลการล็อกอินของผู้ใช้
  const authContext = useAuth();
  
  // state เก็บข้อมูลคำสั่งซื้อทั้งหมด
  const [orders, setOrders] = useState<Order[]>([]);
  
  // state สำหรับแสดงสถานะการโหลด
  const [loading, setLoading] = useState(true);
  
  // state สำหรับเก็บข้อผิดพลาด (หากมี)
  const [error, setError] = useState<string | null>(null);

  // useEffect - ทำงานเมื่อ component ถูกโหลดหรือ auth status เปลี่ยน
  useEffect(() => {
    // ถ้าผู้ใช้ล็อกอินแล้ว ให้ดึงข้อมูลประวัติคำสั่งซื้อ
    if (authContext.isLoggedIn) {
      fetchOrderHistory();
    } else {
      // ถ้ายังไม่ล็อกอิน ปิดสถานะ loading
      setLoading(false);
    }
  }, [authContext.isLoggedIn]); // ทำงานใหม่เมื่อ auth status เปลี่ยน

  // ฟังก์ชันดึงข้อมูลประวัติคำสั่งซื้อจาก server
  const fetchOrderHistory = async () => {
    try {
      // เริ่มสถานะการโหลด
      setLoading(true);
      
      // ล้าง error เก่า (หากมี)
      setError(null);
      
      // เรียกใช้ service เพื่อดึงข้อมูลประวัติคำสั่งซื้อ
      const response = await orderService.getOrderHistory();
      
      // ตัวแปรเก็บข้อมูลคำสั่งซื้อที่ได้รับ
      let ordersData: Order[] = [];

      // ตรวจสอบรูปแบบข้อมูลที่ได้รับจาก server
      if (Array.isArray(response.data)) {
        // ถ้า response.data เป็น array ตรงๆ
        ordersData = response.data;
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
        // ถ้า response.data.data เป็น array (nested format)
        ordersData = response.data.data;
      } else {
        // ถ้ารูปแบบข้อมูลไม่ตรงกับที่คาดหวัง
        ordersData = [];
      }

      // อัปเดต state ด้วยข้อมูลที่ได้รับ
      setOrders(ordersData);
    } catch (error: unknown) {
      // แสดง error แต่ไม่หยุดการแสดงผล
      setError("Error loading orders");
      
      // แปลง error เป็นข้อความที่สามารถแสดงได้
      const message = getErrorMessage(error);

      // แสดง toast notification
      if (error instanceof AxiosError && error.response?.status === 401) {
        // หาก token ไม่ถูกต้องหรือหมดอายุ
        toast.error("กรุณาเข้าสู่ระบบอีกครั้ง");
      } else {
        // error อื่นๆ
        toast.error(`ไม่สามารถโหลดประวัติคำสั่งซื้อได้: ${message}`);
      }
      
      // แม้เกิด error ให้ยังแสดงข้อมูลที่มีอยู่ (เช่น local orders)
      try {
        // พยายามโหลดข้อมูลจาก localStorage หาก API ล้มเหลว
        const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
        setOrders(localOrders);
      } catch (localError) {
        console.warn("Could not load local orders:", localError);
        setOrders([]);
      }
    } finally {
      // ปิดสถานะการโหลดไม่ว่าจะสำเร็จหรือล้มเหลว
      setLoading(false);
    }
  };

  // ฟังก์ชันยืนยันการได้รับสินค้า
  const handleConfirmDelivery = async (orderId: number) => {
    try {
      // เรียก API เพื่อยืนยันว่าได้รับสินค้าแล้ว
      await orderService.confirmDelivery(orderId);
      // แสดง toast ยืนยัน
      toast.success("ยืนยันการรับสินค้าเรียบร้อย");
      // โหลดข้อมูลใหม่เพื่อแสดงผลลัพธ์ที่อัปเดต
      fetchOrderHistory();
    } catch (error: unknown) {
      // จัดการ error หากยืนยันไม่สำเร็จ
      console.error("Error confirming delivery:", error);
      const message = getErrorMessage(error);
      toast.error(`ยืนยันการรับสินค้าล้มเหลว: ${message}`);
    }
  };

  // ฟังก์ชันแปลงสถานะเป็นข้อความภาษาไทย
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'รอดำเนินการ';
      case 'processing': return 'กำลังดำเนินการ';
      case 'preparing': return 'กำลังจัดเตรียม';
      case 'shipping': return 'กำลังจัดส่ง';
      case 'delivered': return 'จัดส่งเสร็จสิ้นแล้ว';
      case 'completed': return 'เสร็จสิ้น';
      case 'canceled': return 'ออเดอร์ถูกยกเลิก';
      case 'cancelled': return 'ออเดอร์ถูกยกเลิก';
      default: return status;
    }
  };

  // ฟังก์ชันกำหนดสีตามสถานะคำสั่งซื้อ
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-600';
      case 'processing': return 'text-yellow-600';
      case 'preparing': return 'text-yellow-600';
      case 'shipping': return 'text-blue-600';
      case 'delivered': return 'text-green-600';
      case 'completed': return 'text-green-600';
      case 'canceled': return 'text-red-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // ถ้ากำลังโหลดข้อมูล ให้แสดง spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8C6E63]"></div>
      </div>
    );
  }

  // ส่วนแสดงผล HTML (JSX)
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      {/* หัวข้อหน้า */}
      <h1 className="text-4xl font-bold text-black mb-12">ประวัติการสั่งซื้อ</h1>
      
      {/* แสดง error message หากมี */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}
      
      {/* กล่องหลักที่มีขนาดจำกัด */}
      <div className="w-full max-w-[1200px]">
        {/* ตรวจสอบว่ามีคำสั่งซื้อหรือไม่ */}
        {orders.length > 0 ? (
          // ถ้ามีคำสั่งซื้อ ให้แสดง card ของแต่ละคำสั่งซื้อ
          <div className="space-y-6">
            {/* วนลูปแสดงแต่ละคำสั่งซื้อ */}
            {orders.map((order) => (
              <div 
                key={order.id} // ใช้ id เป็น key สำหรับการ render ใน React
                className="w-full max-w-[1200px] h-auto bg-white rounded-[25px] shadow-lg p-6 cursor-pointer"
                // คลิก card เพื่อไปหน้ารายละเอียดคำสั่งซื้อ
                onClick={() => navigate(`/order-detail/${order.id}`)}
              >
                {/* ส่วนแสดงข้อมูลหลักของคำสั่งซื้อ */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    {/* แสดงเลขที่คำสั่งซื้อ */}
                    <div className="text-black text-xl font-bold">
                      คำสั่งซื้อ #{order.id}
                    </div>
                    {/* แสดงวันที่สั่งซื้อในรูปแบบภาษาไทย */}
                    <div className="text-gray-600 text-sm">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </div>
                    {/* แสดงราคารวม */}
                    <div className="text-black font-medium mt-1">
                      ยอดรวม: ฿{order.total_amount ? order.total_amount.toFixed(2) : '0.00'}
                    </div>
                    {/* แสดงสถานะคำสั่งซื้อ */}
                    <div className={`font-semibold mt-1 ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                  </div>
                  
                  {/* ส่วนแสดงปุ่มยืนยันการรับสินค้า */}
                  <div className="mt-4 md:mt-0">
                    {/* แสดงปุ่มเฉพาะเมื่อสถานะคำสั่งซื้อเป็น 'shipping' */}
                    {order.status === 'shipping' && (
                      <button
                        // ป้องกันไม่ให้ event ไป trigger ที่ div แม่ (ไม่ไปหน้ารายละเอียด)
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
                
                {/* ส่วนแสดงรูปสินค้าในคำสั่งซื้อ */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {/* แสดงรูปสินค้า 3 ชิ้นแรก */}
                  {order.order_items?.slice(0, 3).map((item, index) => (
                    <div key={index} className="w-16 h-16">
                      <img 
                        src={item.product_image} 
                        alt={item.product_name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                  {/* ถ้ามีสินค้ามากกว่า 3 ชิ้น แสดง +X แทนชิ้นที่เหลือ */}
                  {order.order_items && order.order_items.length > 3 && (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-gray-600">
                      +{order.order_items.length - 3}
                    </div>
                  )}
                </div>
                
                {/* ส่วนแสดงที่อยู่จัดส่ง */}
                <div className="mt-4 text-gray-600 text-sm">
                  <div className="flex items-start">
                    {/* ไอคอนแผนที่ */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2 mt-0.5">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                    {/* แสดงรายละเอียดที่อยู่ */}
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
          // ถ้าไม่มีคำสั่งซื้อ แสดงข้อความแจ้ง
          <div className="text-center py-12 text-gray-600">
            <p>ยังไม่มีประวัติการสั่งซื้อ</p>
            <p className="text-sm mt-2">หากไม่เห็นข้อมูลที่ควรจะมีอยู่ โปรดตรวจสอบ console สำหรับ log เพิ่มเติม</p>
          </div>
        )}
      </div>
    </div>
  );
};

// export component เพื่อให้สามารถใช้ได้จากที่อื่น
export default OrderHistory;
