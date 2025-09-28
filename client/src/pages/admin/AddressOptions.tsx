import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import addressOptionService, { AddressOption, CreateAddressOptionDto } from '../../services/addressOptionService';

const AddressOptions: React.FC = () => {
  const [addressOptions, setAddressOptions] = useState<AddressOption[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editAddressOption, setEditAddressOption] = useState<AddressOption | null>(null);
  const [form, setForm] = useState<Omit<CreateAddressOptionDto, 'id'>>({
    user_id: 0,
    ao_name: '',
  });

  const fetchAddressOptions = async () => {
    setLoading(true);
    try {
      const res = await addressOptionService.getAllAddressOptions();
      setAddressOptions(res.data.data);
    } catch (err) {
      console.error('Error fetching address options:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddressOptions();
  }, []);

  const handleAdd = () => {
    setEditAddressOption(null);
    setForm({
      user_id: 0,
      ao_name: '',
    });
    setModalOpen(true);
  };

  const handleEdit = (addressOption: AddressOption) => {
    setEditAddressOption(addressOption);
    setForm({
      user_id: addressOption.user_id,
      ao_name: addressOption.ao_name,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('คุณแน่ใจว่าต้องการลบตัวเลือกที่อยู่นี้?')) return;
    try {
      await addressOptionService.deleteAddressOption(id);
      fetchAddressOptions();
    } catch (err) {
      console.error('Error deleting address option:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editAddressOption?.id) {
        await addressOptionService.updateAddressOption(editAddressOption.id, { ao_name: form.ao_name });
      } else {
        await addressOptionService.createAddressOption(form);
      }
      setModalOpen(false);
      fetchAddressOptions();
    } catch (err) {
      console.error('Error saving address option:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Address Option Management Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">จัดการตัวเลือกที่อยู่</h3>
            <button 
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มตัวเลือกที่อยู่
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อตัวเลือก</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : addressOptions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">ไม่พบตัวเลือกที่อยู่</td>
                </tr>
              ) : (
                addressOptions.map((addressOption) => (
                  <tr key={addressOption.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{addressOption.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{addressOption.user_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{addressOption.ao_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => console.log('View address option details not implemented yet')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleEdit(addressOption)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded text-red-600"
                          onClick={() => handleDelete(addressOption.id)}
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

      {/* Address Option Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 bg-black">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">
              {editAddressOption ? 'แก้ไขตัวเลือกที่อยู่' : 'เพิ่มตัวเลือกที่อยู่'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="number"
                placeholder="User ID"
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: Number(e.target.value) })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                placeholder="ชื่อตัวเลือก"
                value={form.ao_name}
                onChange={(e) => setForm({ ...form, ao_name: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
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

export default AddressOptions;