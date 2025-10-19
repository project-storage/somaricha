import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";
import { toast } from "react-toastify";

interface User {
  id: number;
  username: string;
  user_name: string;
  user_lastname: string;
  email: string;
  tel: string;
  user_role: string;
  created_at: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isLoggedIn && userRole === 'owner') {
      fetchUsers();
    } else {
      toast.error("คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้");
      navigate("/admin");
    }
  }, [isLoggedIn, userRole, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      let usersData = [];
      
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
        usersData = response.data.data;
      } else {
        console.error("Unexpected API response format:", response);
        toast.error("ข้อมูลผู้ใช้ไม่อยู่ในรูปแบบที่ถูกต้อง");
      }
      
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.user_lastname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8C6E63]"></div>
      </div>
    );
  }

  if (userRole !== 'owner') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">จัดการผู้ใช้งาน</h1>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="ค้นหาผู้ใช้..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left text-black font-semibold">ID</th>
                <th className="py-3 px-4 text-left text-black font-semibold">ชื่อผู้ใช้</th>
                <th className="py-3 px-4 text-left text-black font-semibold">ชื่อ</th>
                <th className="py-3 px-4 text-left text-black font-semibold">นามสกุล</th>
                <th className="py-3 px-4 text-left text-black font-semibold">อีเมล</th>
                <th className="py-3 px-4 text-left text-black font-semibold">เบอร์โทรศัพท์</th>
                <th className="py-3 px-4 text-left text-black font-semibold">บทบาท</th>
                <th className="py-3 px-4 text-left text-black font-semibold">วันที่สร้าง</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-black">{user.id}</td>
                  <td className="py-3 px-4 text-black">{user.username || 'N/A'}</td>
                  <td className="py-3 px-4 text-black">{user.user_name || 'N/A'}</td>
                  <td className="py-3 px-4 text-black">{user.user_lastname || 'N/A'}</td>
                  <td className="py-3 px-4 text-black">{user.email || 'N/A'}</td>
                  <td className="py-3 px-4 text-black">{user.tel || 'N/A'}</td>
                  <td className="py-3 px-4 text-black capitalize">{user.user_role || 'N/A'}</td>
                  <td className="py-3 px-4 text-black">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('th-TH') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            ไม่พบผู้ใช้ที่ตรงกับการค้นหา
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;