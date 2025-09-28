import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for analytics
const salesData = [
  { name: 'ม.ค.', sales: 4000 },
  { name: 'ก.พ.', sales: 3000 },
  { name: 'มี.ค.', sales: 2000 },
  { name: 'เม.ย.', sales: 2780 },
  { name: 'พ.ค.', sales: 1890 },
  { name: 'มิ.ย.', sales: 2390 },
  { name: 'ก.ค.', sales: 3490 },
  { name: 'ส.ค.', sales: 4000 },
  { name: 'ก.ย.', sales: 3000 },
];

const orderStatusData = [
  { name: 'เสร็จสิ้น', value: 75 },
  { name: 'กำลังดำเนินการ', value: 15 },
  { name: 'ยกเลิก', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">วิเคราะห์ยอดขาย</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" name="ยอดขาย (บาท)" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">สถานะคำสั่งซื้อ</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">สรุปสถิติ</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">ยอดขายรวม</span>
              <span className="text-xl font-bold text-green-600">฿150,000</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">คำสั่งซื้อใหม่</span>
              <span className="text-xl font-bold text-blue-600">125</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">ลูกค้าใหม่</span>
              <span className="text-xl font-bold text-purple-600">45</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">สินค้าคงเหลือ</span>
              <span className="text-xl font-bold text-yellow-600">89</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;