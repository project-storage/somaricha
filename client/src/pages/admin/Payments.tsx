import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import paymentService, { Payment, PaymentStatus, CreatePaymentDto } from '../../services/paymentService';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [form, setForm] = useState<Omit<CreatePaymentDto, 'id'>>({
    payment_name: PaymentStatus.ONLY_CASE,
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getAllPayments();
      setPayments(res.data.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAdd = () => {
    setEditPayment(null);
    setForm({
      payment_name: PaymentStatus.ONLY_CASE,
    });
    setModalOpen(true);
  };

  const handleEdit = (payment: Payment) => {
    setEditPayment(payment);
    setForm({
      payment_name: payment.payment_name,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('คุณแน่ใจว่าต้องการลบช่องทางการชำระเงินนี้?')) return;
    try {
      await paymentService.deletePayment(id);
      fetchPayments();
    } catch (err) {
      console.error('Error deleting payment:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editPayment?.id) {
        await paymentService.updatePayment(editPayment.id, form);
      } else {
        await paymentService.createPayment(form);
      }
      setModalOpen(false);
      fetchPayments();
    } catch (err) {
      console.error('Error saving payment:', err);
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.ONLY_CASE:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.CREDIT_CARD:
        return 'bg-blue-100 text-blue-800';
      case PaymentStatus.MOBILE_BANKING:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Management Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">จัดการช่องทางการชำระเงิน</h3>
            <button 
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มช่องทางการชำระเงิน
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อช่องทาง</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">ไม่พบช่องทางการชำระเงิน</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.payment_name)}`}>
                        {payment.payment_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => console.log('View payment details not implemented yet')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleEdit(payment)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded text-red-600"
                          onClick={() => handleDelete(payment.id)}
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

      {/* Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">
              {editPayment ? 'แก้ไขช่องทางการชำระเงิน' : 'เพิ่มช่องทางการชำระเงิน'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <select
                value={form.payment_name}
                onChange={(e) => setForm({ ...form, payment_name: e.target.value as PaymentStatus })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value={PaymentStatus.ONLY_CASE}>เงินสด</option>
                <option value={PaymentStatus.CREDIT_CARD}>บัตรเครดิต</option>
                <option value={PaymentStatus.MOBILE_BANKING}>โมบายแบงค์กิ้ง</option>
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

export default Payments;