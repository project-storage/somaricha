import React from 'react';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import StatsCard from '../../components/card/StatusCard';

// Type สำหรับ StatsCard
interface StatsCardType {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

// Type สำหรับ Order
interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: 'Completed' | 'Processing' | 'Shipped' | 'Pending';
}

const Dashboard: React.FC = () => {
  const statsCards: StatsCardType[] = [
    { title: 'Total Users', value: '12,345', change: '+12%', trend: 'up', color: 'blue' },
    { title: 'Revenue', value: '฿45,678', change: '+8%', trend: 'up', color: 'green' },
    { title: 'Orders', value: '1,234', change: '-3%', trend: 'down', color: 'yellow' },
    { title: 'Conversion', value: '3.45%', change: '+5%', trend: 'up', color: 'purple' },
  ];

  const recentOrders: Order[] = [
    { id: '#12345', customer: 'John Doe', product: 'MacBook Pro', amount: '฿65,000', status: 'Completed' },
    { id: '#12346', customer: 'Jane Smith', product: 'iPhone 15', amount: '฿32,900', status: 'Processing' },
    { id: '#12347', customer: 'Mike Johnson', product: 'iPad Air', amount: '฿24,900', status: 'Shipped' },
    { id: '#12348', customer: 'Sarah Wilson', product: 'AirPods Pro', amount: '฿8,900', status: 'Pending' },
    { id: '#12349', customer: 'David Brown', product: 'Apple Watch', amount: '฿12,900', status: 'Completed' },
  ];

  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add New
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
              {recentOrders.map((order) => (
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
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
