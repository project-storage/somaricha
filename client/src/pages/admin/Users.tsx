import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import userService, { User, UserRole } from '../../services/userService';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<User, 'id'>>({
    user_name: '',
    user_lastname: '',
    user_imageUrl: '',
    user_birth: new Date(),
    user_role: UserRole.USER,
    tel: '',
    email: '',
    username: '',
    password: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers();
      setUsers(res.data.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditUser(null);
    setForm({
      user_name: '',
      user_lastname: '',
      user_imageUrl: '',
      user_birth: new Date(),
      user_role: UserRole.USER,
      tel: '',
      email: '',
      username: '',
      password: '',
    });
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setForm({
      user_name: user.user_name,
      user_lastname: user.user_lastname,
      user_imageUrl: user.user_imageUrl || '',
      user_birth: user.user_birth,
      user_role: user.user_role,
      tel: user.tel,
      email: user.email,
      username: user.username,
      password: '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('คุณแน่ใจว่าต้องการลบผู้ใช้นี้?')) return;
    try {
      await userService.deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editUser?.id) {
        await userService.updateUser(editUser.id, form);
      } else {
        // For new user, we need to call register API instead
        // Since we can't create a user without password, we'll skip creating from here
        // or implement a different flow for admin to create users
        throw new Error('User creation from admin panel not implemented');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  const getStatusColor = (role: UserRole) => {
    return role === UserRole.OWNER ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      {/* User Management Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">จัดการผู้ใช้งาน</h3>
            <button 
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มผู้ใช้
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">นามสกุล</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทร</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">บทบาท</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">ไม่พบข้อมูลผู้ใช้งาน</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.user_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.user_lastname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.tel}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.user_role)}`}>
                        {user.user_role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => console.log('View user details not implemented yet')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded text-red-600"
                          onClick={() => handleDelete(user.id)}
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

      {/* User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 bg-black">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">
              {editUser ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="ชื่อ"
                value={form.user_name}
                onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                placeholder="นามสกุล"
                value={form.user_lastname}
                onChange={(e) => setForm({ ...form, user_lastname: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                placeholder="เบอร์โทร"
                value={form.tel}
                onChange={(e) => setForm({ ...form, tel: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="email"
                placeholder="อีเมล"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="url"
                placeholder="URL รูปภาพ"
                value={form.user_imageUrl}
                onChange={(e) => setForm({ ...form, user_imageUrl: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="date"
                value={form.user_birth instanceof Date ? form.user_birth.toISOString().split('T')[0] : new Date(form.user_birth).toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, user_birth: new Date(e.target.value) })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <select
                value={form.user_role}
                onChange={(e) => setForm({ ...form, user_role: e.target.value as UserRole })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value={UserRole.USER}>USER</option>
                <option value={UserRole.OWNER}>OWNER</option>
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

export default Users;
