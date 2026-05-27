import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import StatsCard from '../../components/card/StatusCard';
import userService from '../../services/userService';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type Trend = 'up' | 'down';
type CardColor = 'blue' | 'green' | 'yellow' | 'purple';
type OrderStatus = 'Completed' | 'Processing' | 'Shipped' | 'Pending';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: Trend;
  color: CardColor;
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: OrderStatus;
  originalId: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [statsCards, setStatsCards] = useState<StatCard[]>([
    { title: 'ผู้ใช้งานทั้งหมด', value: '0', change: '+0 คน', trend: 'up', color: 'blue' },
    { title: 'รายได้รวม (เสร็จสิ้น)', value: '฿0', change: 'จาก 0 ออเดอร์', trend: 'up', color: 'green' },
    { title: 'คำสั่งซื้อทั้งหมด', value: '0', change: 'รวมทั้งหมด', trend: 'up', color: 'yellow' },
    { title: 'สินค้าทั้งหมด', value: '0', change: 'มีสินค้าขายในร้าน', trend: 'up', color: 'purple' },
  ]);

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch users
      const usersRes = await userService.getAllUsers();
      const usersList = Array.isArray(usersRes.data) 
        ? usersRes.data 
        : (usersRes.data?.data && Array.isArray(usersRes.data.data)) 
        ? usersRes.data.data 
        : [];

      // Fetch products
      const productsRes = await productService.getAllProducts();
      const productsList = Array.isArray(productsRes.data)
        ? productsRes.data
        : (productsRes.data?.data && Array.isArray(productsRes.data.data))
        ? productsRes.data.data
        : [];

      // Fetch orders
      const ordersRes = await orderService.getAllOrders();
      const ordersList = Array.isArray(ordersRes.data)
        ? ordersRes.data
        : (ordersRes.data?.data && Array.isArray(ordersRes.data.data))
        ? ordersRes.data.data
        : [];

      // Calculate total revenue from delivered/completed orders
      const completedOrders = ordersList.filter((o: any) => o.status === 'completed' || o.status === 'delivered');
      const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + parseFloat(o.total_price || o.total_amount || 0), 0);

      // Construct dynamic Stats Cards
      setStatsCards([
        { title: 'ผู้ใช้งานทั้งหมด', value: usersList.length.toLocaleString(), change: `+${usersList.length} คน`, trend: 'up', color: 'blue' },
        { title: 'รายได้รวม (เสร็จสิ้น)', value: `฿${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: completedOrders.length > 0 ? `จาก ${completedOrders.length} ออเดอร์` : 'จาก 0 ออเดอร์', trend: 'up', color: 'green' },
        { title: 'คำสั่งซื้อทั้งหมด', value: ordersList.length.toLocaleString(), change: `รวมทั้งหมด`, trend: 'up', color: 'yellow' },
        { title: 'สินค้าทั้งหมด', value: productsList.length.toLocaleString(), change: `มีสินค้าขายในร้าน`, trend: 'up', color: 'purple' },
      ]);

      // Construct Recent Orders Table
      // Sort orders by id descending
      const sortedOrders = [...ordersList].sort((a: any, b: any) => b.id - a.id);
      const recent = sortedOrders.slice(0, 5).map((order: any) => {
        const productName = order.order_items?.[0]?.product_name || 'ชาสมุนไพรเจแปนนิสสตีเวีย';
        return {
          id: `#${order.id}`,
          customer: order.address?.recipient_name || order.user?.user_name || 'N/A',
          product: order.order_items && order.order_items.length > 1 
            ? `${productName} (และอีก ${order.order_items.length - 1} รายการ)` 
            : productName,
          amount: `฿${parseFloat(order.total_price || order.total_amount || 0).toLocaleString()}`,
          status: (order.status === 'completed' || order.status === 'delivered' ? 'Completed' :
                  order.status === 'shipping' ? 'Shipped' :
                  order.status === 'processing' || order.status === 'preparing' ? 'Processing' : 'Pending') as OrderStatus,
          originalId: order.id
        };
      });

      setRecentOrders(recent);
    } catch (err: any) {
      console.error('Error fetching dashboard statistics:', err);
      toast.error('ไม่สามารถโหลดข้อมูลสถิติหน้า Dashboard ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8C6E63]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">รายการสั่งซื้อล่าสุด</h3>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
            >
              ดูทั้งหมด
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Product</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">ไม่พบรายการสั่งซื้อล่าสุด</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">{order.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => navigate('/admin/orders')}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="ดูรายละเอียดใบสั่งซื้อ"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
