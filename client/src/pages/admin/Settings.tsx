import React, { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  // Mock settings data
  const [settings, setSettings] = useState({
    siteName: 'Somari Cha',
    siteDescription: 'ร้านชาหมึกไข่มุกอร่อยที่สุดในโลก',
    contactEmail: 'info@somaricha.com',
    contactPhone: '+66 81 234 5678',
    address: '123 ถ. ชาไข่มุก ต. ใจกลางเมือง อ. เมือง จ. กรุงเทพมหานคร 10110',
    openTime: '08:00',
    closeTime: '22:00',
    notificationEmail: true,
    notificationSms: false,
    enableReviews: true,
    enableCoupons: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Settings saved:', settings);
    alert('บันทึกการตั้งค่าเรียบร้อยแล้ว');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="border-b border-gray-200">
        <nav className="flex">
          {['general', 'store', 'notifications', 'security'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-4 font-medium text-sm ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'general' && 'ทั่วไป'}
              {tab === 'store' && 'ร้านค้า'}
              {tab === 'notifications' && 'การแจ้งเตือน'}
              {tab === 'security' && 'ความปลอดภัย'}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อเว็บไซต์</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบายเว็บไซต์</label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมลติดต่อ</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        )}

        {activeTab === 'store' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
              <input
                type="text"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ร้าน</label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เวลาเปิด</label>
                <input
                  type="time"
                  name="openTime"
                  value={settings.openTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เวลาปิด</label>
                <input
                  type="time"
                  name="closeTime"
                  value={settings.closeTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="enableReviews"
                checked={settings.enableReviews}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">เปิดใช้งานรีวิว</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="enableCoupons"
                checked={settings.enableCoupons}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">เปิดใช้งานคูปองส่วนลด</label>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="notificationEmail"
                checked={settings.notificationEmail}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">ส่งอีเมลแจ้งเตือน</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="notificationSms"
                checked={settings.notificationSms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">ส่ง SMS แจ้งเตือน</label>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เปลี่ยนรหัสผ่าน</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="password"
                  placeholder="รหัสผ่านใหม่"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="password"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันตัวตนสองชั้น</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">เปิดใช้งาน 2FA</label>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
          >
            บันทึกการตั้งค่า
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;