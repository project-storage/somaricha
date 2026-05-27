
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import userService from '../../services/userService';
import { toast } from 'react-toastify';

const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B'];
const MONTHS_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

interface SalesMonth {
  name: string;
  sales: number;
  [key: string]: any;
}

interface OrderStatusItem {
  name: string;
  value: number;
  [key: string]: any;
}

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<SalesMonth[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusItem[]>([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    newOrdersCount: 0,
    newCustomersCount: 0,
    inventoryCount: 0,
  });

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch all required resources concurrently
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts(),
        userService.getAllUsers(),
      ]);

      const orders = Array.isArray(ordersRes.data)
        ? ordersRes.data
        : (ordersRes.data?.data && Array.isArray(ordersRes.data.data))
        ? ordersRes.data.data
        : [];

      const products = Array.isArray(productsRes.data)
        ? productsRes.data
        : (productsRes.data?.data && Array.isArray(productsRes.data.data))
        ? productsRes.data.data
        : [];

      const users = Array.isArray(usersRes.data)
        ? usersRes.data
        : (usersRes.data?.data && Array.isArray(usersRes.data.data))
        ? usersRes.data.data
        : [];

      // 1. Calculate Summary Stats
      const completedOrders = orders.filter(
        (o: any) => o.status === 'completed' || o.status === 'delivered'
      );
      const totalSalesSum = completedOrders.reduce(
        (sum: number, o: any) => sum + parseFloat(o.total_price || o.total_amount || 0),
        0
      );

      // Filter customers (role 'user')
      const customersList = users.filter((u: any) => u.user_role === 'user');

      setSummary({
        totalSales: totalSalesSum,
        newOrdersCount: orders.length,
        newCustomersCount: customersList.length,
        inventoryCount: products.length,
      });

      // 2. Aggregate Sales Data by Month (Current Year)
      const currentYear = new Date().getFullYear();
      const monthlySalesMap: { [key: number]: number } = {};
      
      // Initialize map
      for (let i = 0; i < 12; i++) {
        monthlySalesMap[i] = 0;
      }

      completedOrders.forEach((o: any) => {
        const orderDateStr = o.created_at || o.orderdatetime || o.order_date;
        if (orderDateStr) {
          const date = new Date(orderDateStr);
          if (date.getFullYear() === currentYear) {
            const monthIdx = date.getMonth();
            const val = parseFloat(o.total_price || o.total_amount || 0);
            monthlySalesMap[monthIdx] += val;
          }
        }
      });

      // Construct sales data array (show up to current month for visual appeal or all 12)
      const formattedSales = MONTHS_TH.map((monthName, idx) => ({
        name: monthName,
        sales: monthlySalesMap[idx],
      }));
      setSalesData(formattedSales);

      // 3. Aggregate Order Statuses
      let completedCount = 0;
      let inProgressCount = 0;
      let canceledCount = 0;

      orders.forEach((o: any) => {
        const status = (o.status || '').toLowerCase();
        if (status === 'completed' || status === 'delivered') {
          completedCount++;
        } else if (status === 'canceled' || status === 'cancelled') {
          canceledCount++;
        } else {
          inProgressCount++;
        }
      });

      const formattedStatuses: OrderStatusItem[] = [
        { name: 'เสร็จสิ้น', value: completedCount },
        { name: 'กำลังดำเนินการ', value: inProgressCount },
        { name: 'ยกเลิก', value: canceledCount },
      ].filter(item => item.value > 0); // Only render slices that have at least 1 item

      // Fallback if empty to avoid breaking charts
      if (formattedStatuses.length === 0) {
        formattedStatuses.push({ name: 'ไม่มีคำสั่งซื้อ', value: 0 });
      }

      setOrderStatusData(formattedStatuses);

    } catch (err: any) {
      console.error('Error loading analytics:', err);
      toast.error('ไม่สามารถโหลดข้อมูลการวิเคราะห์ระบบได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8C6E63]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sales Analytics Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">วิเคราะห์ยอดขาย (บาท) ของปีนี้</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`฿${Number(value).toLocaleString()}`, 'ยอดขาย']} />
              <Legend />
              <Bar dataKey="sales" name="ยอดขาย (บาท)" fill="#8C6E63" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">สัดส่วนสถานะคำสั่งซื้อ</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${typeof percent === 'number' ? (percent * 100).toFixed(0) : '0'}%`}
                >
                  {orderStatusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} ออเดอร์`, 'จำนวน']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Summary List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">สรุปสถิติร้านค้า</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition">
              <span className="text-gray-600 font-medium">ยอดขายรวมที่สำเร็จ</span>
              <span className="text-xl font-bold text-green-600">
                ฿{summary.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition">
              <span className="text-gray-600 font-medium">จำนวนคำสั่งซื้อทั้งหมด</span>
              <span className="text-xl font-bold text-blue-600">
                {summary.newOrdersCount.toLocaleString()} ออเดอร์
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition">
              <span className="text-gray-600 font-medium">ลูกค้าที่เป็นสมาชิก</span>
              <span className="text-xl font-bold text-purple-600">
                {summary.newCustomersCount.toLocaleString()} คน
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition">
              <span className="text-gray-600 font-medium">ประเภทสินค้าที่มีขาย</span>
              <span className="text-xl font-bold text-yellow-600">
                {summary.inventoryCount.toLocaleString()} รายการ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;