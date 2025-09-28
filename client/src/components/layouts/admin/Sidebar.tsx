import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { X, Home, Users, ShoppingCart, BarChart3, Settings, Box, CreditCard, MapPin } from 'lucide-react';
import authService from '../../../services/authService';

// กำหนด type สำหรับ props
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface SidebarItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    { path: '/admin/dashboard', icon: Home, label: 'แดชบอร์ด' },
    { path: '/admin/users', icon: Users, label: 'ผู้ใช้งาน' },
    { path: '/admin/products', icon: Box, label: 'สินค้า' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'ออเดอร์' },
    { path: '/admin/payments', icon: CreditCard, label: 'การชำระเงิน' },
    { path: '/admin/addresses', icon: MapPin, label: 'ที่อยู่' },
    { path: '/admin/address-options', icon: MapPin, label: 'ตัวเลือกที่อยู่' },
    { path: '/admin/analytics', icon: BarChart3, label: 'สถิติ' },
    { path: '/admin/settings', icon: Settings, label: 'การตั้งค่า' },
  ];

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
    setSidebarOpen(false);
  };

  return (
    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>

      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">แผงควบคุม</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="mt-8">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'}`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          );
        })}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-colors mt-4"
        >
          ออกจากระบบ
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
