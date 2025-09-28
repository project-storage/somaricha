import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import addressService, { Address, CreateAddressDto } from '../../services/addressService';

const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<Omit<CreateAddressDto, 'id'>>({
    ao_id: 0,
    number: '',
    road: '',
    subdistrict: '',
    district: '',
    province: '',
    code_zip: 0,
    address_detail: '',
  });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await addressService.getAllAddresses();
      setAddresses(res.data.data);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = () => {
    setEditAddress(null);
    setForm({
      ao_id: 0,
      number: '',
      road: '',
      subdistrict: '',
      district: '',
      province: '',
      code_zip: 0,
      address_detail: '',
    });
    setModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditAddress(address);
    setForm({
      ao_id: address.ao_id,
      number: address.number,
      road: address.road,
      subdistrict: address.subdistrict,
      district: address.district,
      province: address.province,
      code_zip: address.code_zip,
      address_detail: address.address_detail || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('คุณแน่ใจว่าต้องการลบที่อยู่นี้?')) return;
    try {
      await addressService.deleteAddress(id);
      fetchAddresses();
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editAddress?.id) {
        await addressService.updateAddress(editAddress.id, form);
      } else {
        await addressService.createAddress(form);
      }
      setModalOpen(false);
      fetchAddresses();
    } catch (err) {
      console.error('Error saving address:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Address Management Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">จัดการที่อยู่</h3>
            <button 
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มที่อยู่
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">AO ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">บ้านเลขที่</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ถนน</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ตำบล/แขวง</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">อำเภอ/เขต</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">จังหวัด</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสไปรษณีย์</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">รายละเอียด</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : addresses.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-gray-500">ไม่พบที่อยู่</td>
                </tr>
              ) : (
                addresses.map((address) => (
                  <tr key={address.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{address.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{address.ao_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{address.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{address.road}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{address.subdistrict}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{address.district}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{address.province}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{address.code_zip}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{address.address_detail}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => console.log('View address details not implemented yet')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleEdit(address)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded text-red-600"
                          onClick={() => handleDelete(address.id)}
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

      {/* Address Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 bg-black">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">
              {editAddress ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="number"
                placeholder="AO ID"
                value={form.ao_id}
                onChange={(e) => setForm({ ...form, ao_id: Number(e.target.value) })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                placeholder="บ้านเลขที่"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                placeholder="ถนน"
                value={form.road}
                onChange={(e) => setForm({ ...form, road: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="ตำบล/แขวง"
                value={form.subdistrict}
                onChange={(e) => setForm({ ...form, subdistrict: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                placeholder="อำเภอ/เขต"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                placeholder="จังหวัด"
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                placeholder="รหัสไปรษณีย์"
                value={form.code_zip}
                onChange={(e) => setForm({ ...form, code_zip: Number(e.target.value) })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <textarea
                placeholder="รายละเอียดที่อยู่"
                value={form.address_detail}
                onChange={(e) => setForm({ ...form, address_detail: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

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

export default Addresses;