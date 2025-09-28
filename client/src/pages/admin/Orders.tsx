import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import orderService, { Order, OrderStatus, CreateOrderDto } from '../../services/orderService';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [form, setForm] = useState<CreateOrderDto>({
    product_id: 0,
    user_id: 0,
    qty: 1,
    status: OrderStatus.PENDING,
    orderdatetime: new Date(),
    payment_id: 0,
    total_price: 0,
    comemnt_star: undefined,
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders();
      setOrders(res.data.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (order: Order) => {
    setEditOrder(order);
    setForm({
      product_id: order.product_id,
      user_id: order.user_id,
      qty: order.qty,
      status: order.status,
      orderdatetime: order.orderdatetime,
      payment_id: order.payment_id,
      total_price: order.total_price,
      comemnt_star: order.comemnt_star,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('คุณแน่ใจว่าต้องการลบคำสั่งซื้อนี้?')) return;
    try {
      await orderService.deleteOrder(id);
      fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editOrder?.id) {
        await orderService.updateOrder(editOrder.id, {
          status: form.status,
          comemnt_star: form.comemnt_star
        });
      }
      setModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error('Error saving order:', err);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Orders Management Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">จัดการคำสั่งซื้อ</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวน</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ราคารวม</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สั่ง</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">ไม่พบคำสั่งซื้อ</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.product_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.user_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">฿{order.total_price.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(order.orderdatetime).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => console.log('View order details not implemented yet')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleEdit(order)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded text-red-600"
                          onClick={() => handleDelete(order.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Order Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 bg-black">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">
              แก้ไขคำสั่งซื้อ
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="number"
                placeholder="Product ID"
                value={form.product_id}
                onChange={(e) => setForm({ ...form, product_id: Number(e.target.value) })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                placeholder="User ID"
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: Number(e.target.value) })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                placeholder="จำนวน"
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                placeholder="ราคารวม"
                value={form.total_price}
                onChange={(e) => setForm({ ...form, total_price: Number(e.target.value) })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="date"
                value={new Date(form.orderdatetime).toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, orderdatetime: new Date(e.target.value) })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as OrderStatus })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value={OrderStatus.PENDING}>PENDING</option>
                <option value={OrderStatus.PROCESSING}>PROCESSING</option>
                <option value={OrderStatus.COMPLETED}>COMPLETED</option>
                <option value={OrderStatus.CANCELED}>CANCELED</option>
              </select>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
                  onClick={() => setModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;