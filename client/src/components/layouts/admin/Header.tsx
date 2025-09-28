import React from 'react';
import { useLocation } from 'react-router';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';

// กำหนด type สำหรับ props
interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const location = useLocation();
  const currentPage: string = location.pathname.slice(1) || 'dashboard';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 capitalize">{currentPage}</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
              A
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
